<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { ImageOffIcon } from 'lucide-vue-next'
import ImageMenuSettings from './ImageMenuSettings.vue';
import type { TImageWidget } from './types';
import { EImageWidgetBackgroundSize, EImageWidgetBackgroundRepeat } from './constants';

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  },
  isPlaceholder: {
    type: Boolean,
    required: false,
    default: false
  },
  placeholderWidget: {
    type: Object as PropType<TImageWidget>,
    required: false,
    default: null
  },
})

const widgetStore = useWidgetStore()
const widget = computed(() => {
  return props.isPlaceholder ? props.placeholderWidget : widgetStore.getWidgetById(props.widgetId) as TImageWidget;
})
const bgPositionStyle = computed(() => {
  return widget.value.content.backgroundPosition.replace('-', ' ')
})
const hasImage = computed(() => {
  return widget.value.content.url !== null
})
</script>

<template>
  <div
    v-bind="$attrs"
    class="widget-theme-bg widget-theme-text flex"
    :class="[
      {
        'items-center justify-center': !hasImage,
        'bg-auto': widget.content.backgroundSize === EImageWidgetBackgroundSize.AUTO,
        'bg-contain': widget.content.backgroundSize === EImageWidgetBackgroundSize.CONTAIN,
        'bg-cover': widget.content.backgroundSize === EImageWidgetBackgroundSize.COVER,
        'bg-repeat': widget.content.backgroundRepeat === EImageWidgetBackgroundRepeat.REPEAT,
        'bg-repeat-x': widget.content.backgroundRepeat === EImageWidgetBackgroundRepeat.REPEAT_X,
        'bg-repeat-y': widget.content.backgroundRepeat === EImageWidgetBackgroundRepeat.REPEAT_Y,
        'bg-no-repeat': widget.content.backgroundRepeat === EImageWidgetBackgroundRepeat.NO_REPEAT,
      },
    ]"
    :style="{
      'background-image': widget.content.url ? 'url(' + widget.content.url + ')' : 'none',
      'background-position': bgPositionStyle,
    }"
  >
    <ImageOffIcon v-if="!hasImage" />
  </div>
  <teleport to="#space__widget-menu">
    <ImageMenuSettings v-if="widgetId" :widgetId="widgetId" />
  </teleport>
</template>

<style scoped>

</style>
