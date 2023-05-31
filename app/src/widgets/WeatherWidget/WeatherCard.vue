<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watchEffect, ref, type PropType } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useWeatherStore } from '@/stores/weather';
import WeatherCardRow from './WeatherCardRow.vue';
import WeatherMenuSettings from './WeatherMenuSettings.vue';
import type { TWeatherWidget } from './types';


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
    type: Object as PropType<TWeatherWidget>,
    required: false,
    default: null
  },
})

const isReady = ref(false)
const widgetStore = useWidgetStore()
const weatherStore = useWeatherStore()
const widget = computed(() => {
  return props.isPlaceholder ? props.placeholderWidget : widgetStore.getWidgetById(props.widgetId) as TWeatherWidget
})
const widgetId = ref<string | null>(null)


watchEffect(() => {
  if (widget.value) {
    widgetId.value = widget.value.uid
  }
})

onMounted(async () => {
  if (!widget.value) {
    return
  }

  await weatherStore.connect(widget.value.uid)
  isReady.value = true
})

onBeforeUnmount(() => {
  if (!widgetId.value) {
    return
  }

  weatherStore.disconnect(widgetId.value)
})
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex flex-col"
  >
    <template v-if="isReady">
      <WeatherCardRow
        v-for="(weatherRow, rowI) in widget.content.items"
        :key="rowI"
        :weatherItem="weatherRow"
      />
    </template>
    <template v-else>
      Loading...
    </template>
  </div>
  <teleport to="#space__widget-menu">
    <WeatherMenuSettings v-if="widgetId" :widgetId="widgetId" />
  </teleport>
</template>

<style scoped>
</style>
