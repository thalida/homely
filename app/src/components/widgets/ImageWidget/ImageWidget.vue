<script setup lang="ts">
import { computed } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { ImageOffIcon } from 'lucide-vue-next'
import { EImageWidgetBackgroundPosition, EImageWidgetBackgroundSize, EImageWidgetBackgroundRepeat } from '@/types/widget';

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const widgetStore = useWidgetStore()
const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId)
})
const isSelected = computed(() => {
  return widget.value?.state?.selected;
})
const backgroundSizes = computed(() => {
  return Object.values(EImageWidgetBackgroundSize)
})
const backgroundPositions = computed(() => {
  return Object.values(EImageWidgetBackgroundPosition)
})
const backgroundRepeats = computed(() => {
  return Object.values(EImageWidgetBackgroundRepeat)
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
    class="flex w-full h-full cursor-pointer bg-slate-100"
    :class="[
      {
        'items-center justify-center': !hasImage,
        'ring-2 ring-pink-500': isSelected,
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
    <div v-if="widget.state.selected">
      <label>
        <span>URL</span>
        <input type="url" class="border border-gray-200" v-model="widget.content.url" />
      </label>
      <label>
        <span>Background Size</span>
        <select v-model="widget.content.backgroundSize" class="border border-gray-200">
          <option v-for="size in backgroundSizes" :value="size" :key="size">{{ size }}</option>
        </select>
      </label>
      <label>
        <span>Background Position</span>
        <select v-model="widget.content.backgroundPosition" class="border border-gray-200">
          <option v-for="position in backgroundPositions" :value="position" :key="position">{{ position }}</option>
        </select>
      </label>
      <label>
        <span>Background Repeat</span>
        <select v-model="widget.content.backgroundRepeat" class="border border-gray-200">
          <option v-for="repeat in backgroundRepeats" :value="repeat" :key="repeat">{{ repeat }}</option>
        </select>
      </label>
    </div>
  </teleport>
</template>

<style scoped>

</style>
