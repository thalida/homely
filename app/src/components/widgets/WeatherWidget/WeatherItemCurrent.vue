<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { IWeatherWidgetItem } from '@/types/widget'
import { useWeatherStore } from '@/stores/weather';
import { useLocationStore } from '@/stores/location';
import { unitsSymbolMap, defaultWeatherSvgMap } from './index'

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  },
  weatherItem: {
    type: Object as PropType<IWeatherWidgetItem>,
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



const currentLottie = computed(() => {
  if (!weatherData.value) {
    return null
  }

  return weatherLottieMap[weatherData.value.currently.weather[0].icon]
})
</script>


<template>
  <div v-if="weatherData && weatherData.currently" class="flex flex-col w-full py-2 px-4 grow justify-center items-center space-y-2">
    <div class="flex flex-row justify-between items-center w-full text-sm">
      <span v-if="weatherItem.showLocation">{{ weatherLocation?.name }}</span>
      <span v-if="weatherItem.showDescription" class="capitalize">
        {{ weatherData.currently.weather[0].description }}
      </span>
    </div>
    <div
      class="flex flex-row justify-between items-center w-full"
      :class="{
        'justify-between': weatherItem.showTemperature && weatherItem.showUnits,
      }">
      <div v-if="weatherItem.showTemperature" class="flex flex-row text-2xl font-bold">
        {{ Math.round(weatherData.currently.temp) }}&deg;
        <span v-if="weatherItem.showUnits">
          {{ unitsSymbolMap[weatherItem.units] }}
        </span>
      </div>
      <img v-if="weatherItem.showIcon" :src="defaultWeatherSvgMap[weatherData.currently.weather[0].icon]" class="h-full w-auto max-h-16" />
    </div>
  </div>
</template>

<style scoped>

</style>
