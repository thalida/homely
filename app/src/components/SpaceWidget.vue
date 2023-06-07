<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type PropType, type Ref } from 'vue'
import { useSpaceStore } from '@/stores/space';
import { useWidgetStore } from '@/stores/widget'
import { cardComponentsByType } from '@/widgets'
import type { IWidget } from '@/types/widget';

const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()

const props = defineProps({
  widgetId: {
    type: String,
    required: true
  },
  isPlaceholder: {
    type: Boolean,
    required: false,
    default: false
  },
  placeholderWidget: {
    type: Object as PropType<IWidget>,
    required: false,
    default: null
  }
})

const widgetComponent: Ref<any | null> = ref(null)

const widget = computed(() => {
  return props.isPlaceholder ? props.placeholderWidget : widgetStore.getWidgetById(props.widgetId)
})

const isSelected = computed(() => {
  return widget.value && widget.value.state ? widget.value.state.selected : false;
})

const isDeleted = computed(() => {
  return widget.value && widget.value.state  ? widget.value.state.deleted : false;
})

const component = computed(() => {
  if (!widget.value) {
    return null
  }
  return cardComponentsByType[widget.value.widget_type]
})

const isRenderable = computed(() => {
  return component.value !== null && !isDeleted.value
})


const widgetThemeClass = computed(() => {
  return `widget-theme-${widget.value?.card_style.background_color}`
})

onBeforeUnmount(() => {
  widgetStore.unselectWidgetById(props.widgetId)
})

watch(() => widget.value?.content, (after, before) => {
  if (typeof before === 'undefined' || typeof after === 'undefined') {
    return
  }

  if (!spaceStore.isEditing[widget.value?.space]) {
    return
  }

  widgetStore.markWidgetAsDirty(props.widgetId)
}, {
  deep: true
})

watch(() => widget.value?.card_style, (after, before) => {
  if (typeof before === 'undefined' || typeof after === 'undefined') {
    return
  }

  if (!spaceStore.isEditing[widget.value?.space]) {
    return
  }

  widgetStore.markWidgetAsDirty(props.widgetId)
}, {
  deep: true
})

function handleWidgetClick() {
  if (!widget.value) {
    return
  }

  const canSelect = (
    (widgetComponent.value && 'canSelect' in widgetComponent.value)
    ? widgetComponent.value.canSelect
    : widgetStore.isEditing[widget.value.space]
  )

  if (!canSelect) {
    widgetStore.unselectAllWidgets(widget.value.space)
    return
  }

  widgetStore.unselectAllWidgets(widget.value.space)
  widgetStore.selectWidgetById(props.widgetId)
}
</script>

<template>
  <component
    v-if="isRenderable"
    ref="widgetComponent"
    :is="component"
    :widgetId="props.widgetId"
    :isPlaceholder="props.isPlaceholder"
    :placeholderWidget="props.placeholderWidget"
    @click="handleWidgetClick"
    class="space-widget rounded-2xl w-full h-full overflow-auto transition duration-200"
    :class="[{
        'ring-4 ring-yellow-500 shadow-2xl': isSelected,
        'ring-0 ring-transparent shadow-none': !isSelected,
    }, widgetThemeClass]"
  />
</template>

<style scoped>
</style>
