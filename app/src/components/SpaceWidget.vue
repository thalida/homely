<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { widgetComponents } from '@/components/widgets'
import { EWidgetColorNames } from '@/types/widget';

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
  return widgetComponents[widget.value.widget_type]
})

const supportedColors = ref(Object.values(EWidgetColorNames))

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
</script>

<template>
  <component
    v-if="component && !isDeleted"
    :is="component"
    v-bind="$attrs"
    :widgetId="props.widgetId"
    class="rounded-2xl w-full h-full overflow-auto"
    :class="{
        'ring-2 ring-yellow-500 drop-shadow-xl': isSelected,
        'widget-bg-red': widget.card_style.background_color === EWidgetColorNames.RED,
        'widget-bg-orange': widget.card_style.background_color === EWidgetColorNames.ORANGE,
        'widget-bg-yellow': widget.card_style.background_color === EWidgetColorNames.YELLOW,
        'widget-bg-green': widget.card_style.background_color === EWidgetColorNames.GREEN,
        'widget-bg-blue': widget.card_style.background_color === EWidgetColorNames.BLUE,
        'widget-bg-purple': widget.card_style.background_color === EWidgetColorNames.PURPLE,
        'widget-bg-pink': widget.card_style.background_color === EWidgetColorNames.PINK,
        'widget-bg-white': widget.card_style.background_color === EWidgetColorNames.WHITE,
        'widget-bg-gray': widget.card_style.background_color === EWidgetColorNames.GRAY,
        'widget-bg-black': widget.card_style.background_color === EWidgetColorNames.BLACK,
        'widget-bg-transparent': widget.card_style.background_color === EWidgetColorNames.TRANSPARENT,
        'widget-bg-white dark:widget-bg-black': widget.card_style.background_color === EWidgetColorNames.DYNAMIC,
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

<style scoped>
</style>
