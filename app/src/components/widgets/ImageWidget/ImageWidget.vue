<script setup lang="ts">
import { computed } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { ImageIcon } from 'lucide-vue-next'
import { EImageWidgetBackgroundSize } from '@/types/widget';

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
const backgroundSizes = computed(() => {
  return Object.values(EImageWidgetBackgroundSize)
})
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex w-full h-full cursor-pointer bg-no-repeat bg-center"
    :class="{
      'bg-auto': widget.content.backgroundSize === EImageWidgetBackgroundSize.AUTO,
      'bg-contain': widget.content.backgroundSize === EImageWidgetBackgroundSize.CONTAIN,
      'bg-cover': widget.content.backgroundSize === EImageWidgetBackgroundSize.COVER,
    }"
    :style="{
      'background-image': widget.content.url ? 'url(' + widget.content.url + ')' : 'none'
    }"
  >
    <ImageIcon v-if="!widget.content.url" />
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
    </div>
  </teleport>
</template>

<style scoped>

</style>
