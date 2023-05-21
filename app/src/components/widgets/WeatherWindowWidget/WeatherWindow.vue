<script setup lang="ts">
import { computed, type PropType, watch } from 'vue';
import type { IWeatherWindowWidgetItem } from '@/types/widget'
import { useWeatherStore } from '@/stores/weather';
import { useLocationStore } from '@/stores/location';

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  },
  weatherItem: {
    type: Object as PropType<IWeatherWindowWidgetItem>,
    required: true,
    default: null
  },
})

const weatherStore = useWeatherStore()
const locationStore = useLocationStore()

const weatherLocation = computed(() => {
  return props.weatherItem.useCurrentLocation ? locationStore.currentLocation : props.weatherItem.location
})

const weatherData = computed(() => {
  if (!weatherLocation.value) {
    return null
  }
  return weatherStore.weatherByLocation[weatherLocation.value.formatted_address]
})

watch(() => props.weatherItem, () => {
  weatherStore.updateWeatherByWigetItem(props.weatherItem)
}, { deep: true })
</script>

<template>
  <div>
    {{  weatherData?.currently  }}
  </div>
</template>

<style scoped>

</style>
