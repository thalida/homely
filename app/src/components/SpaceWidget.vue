<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, watchEffect } from 'vue'
import { useSpaceStore } from '@/stores/space';
import { useWidgetStore } from '@/stores/widget'
import { EWidgetColorNames } from '@/enums/widget';
import { cardComponentsByType } from '@/widgets'

const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()

const props = defineProps({
  widgetId: {
    type: String,
    required: true
  }
})

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId)
})

const isSelected = computed(() => {
  return widget.value ? widget.value.state.selected : false;
})

const isDeleted = computed(() => {
  return widget.value ? widget.value.state.deleted : false;
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

const supportedColors = ref(Object.values(EWidgetColorNames))

onBeforeUnmount(() => {
  widgetStore.unselectWidgetById(props.widgetId)
})

watch(() => widget.value?.content, (after, before) => {
  if (typeof before === 'undefined' || typeof after === 'undefined') {
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

  widgetStore.markWidgetAsDirty(props.widgetId)
}, {
  deep: true
})

function handleWidgetClick() {
  if (!spaceStore.isEditMode) {
    return
  }

  if (widget.value) {
    widgetStore.unselectAllWidgets(widget.value.space)
    widgetStore.selectWidgetById(props.widgetId)
  }
}
</script>

<template>
  <template v-if="isRenderable">
    <component
      :id='`widget-${props.widgetId}`'
      :is="component"
      v-bind="$attrs"
      :widgetId="props.widgetId"
      @click="handleWidgetClick"
      class="space-widget rounded-2xl w-full h-full overflow-auto"
      :class="{
          'ring-2 ring-yellow-500': isSelected,
          'widget-theme-red': widget.card_style.background_color === EWidgetColorNames.RED,
          'widget-theme-orange': widget.card_style.background_color === EWidgetColorNames.ORANGE,
          'widget-theme-yellow': widget.card_style.background_color === EWidgetColorNames.YELLOW,
          'widget-theme-green': widget.card_style.background_color === EWidgetColorNames.GREEN,
          'widget-theme-blue': widget.card_style.background_color === EWidgetColorNames.BLUE,
          'widget-theme-purple': widget.card_style.background_color === EWidgetColorNames.PURPLE,
          'widget-theme-pink': widget.card_style.background_color === EWidgetColorNames.PINK,
          'widget-theme-white': widget.card_style.background_color === EWidgetColorNames.WHITE,
          'widget-theme-gray': widget.card_style.background_color === EWidgetColorNames.GRAY,
          'widget-theme-black': widget.card_style.background_color === EWidgetColorNames.BLACK,
          'widget-theme-transparent': widget.card_style.background_color === EWidgetColorNames.TRANSPARENT,
          'widget-theme-dynamic': widget.card_style.background_color === EWidgetColorNames.DYNAMIC,
        }"
    />
    <teleport to="#space__shared-widget-menu">
      <div v-if="widget.state.selected">
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
