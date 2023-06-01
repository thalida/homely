<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type PropType, type Ref } from 'vue'
import { useSpaceStore } from '@/stores/space';
import { useWidgetStore } from '@/stores/widget'
import { ESpaceTheme } from '@/constants/theme';
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

const supportedColors = ref(Object.values(ESpaceTheme))

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

  if (!spaceStore.isEditMode) {
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

  if (!spaceStore.isEditMode) {
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
    : spaceStore.isEditMode
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
  <template v-if="isRenderable">
    <component
      ref="widgetComponent"
      :is="component"
      v-bind="$attrs"
      :widgetId="props.widgetId"
      :isPlaceholder="props.isPlaceholder"
      :placeholderWidget="props.placeholderWidget"
      @click="handleWidgetClick"
      class="space-widget rounded-2xl w-full h-full overflow-auto"
      :class="[{
          'ring-4 ring-yellow-500 drop-shadow-lg': isSelected,
      }, widgetThemeClass]"
    />
    <teleport to="#space__shared-widget-menu">
      <div v-if="!isPlaceholder && isSelected">
        <label>
          <span>Card Color</span>
          <select
            v-model="widget.card_style.background_color"
            class="block w-full mt-1"
          >
            <option
              v-for="color in supportedColors"
              :key="color"
              :value="color"
            >
              {{ color }}
            </option>
          </select>
        </label>
      </div>
    </teleport>
  </template>
</template>

<style scoped>
</style>
