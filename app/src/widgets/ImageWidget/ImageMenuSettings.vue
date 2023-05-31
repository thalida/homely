<script setup lang="ts">
import { computed } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { EImageWidgetBackgroundPosition, EImageWidgetBackgroundSize, EImageWidgetBackgroundRepeat } from './constants';
import type { TImageWidget } from './types';

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const widgetStore = useWidgetStore()
const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId) as TImageWidget;
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
</script>

<template>
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
</template>

<style scoped>

</style>
