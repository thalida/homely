<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { useWeatherStore } from '@/stores/weather';
import { useLocationStore } from '@/stores/location';
import * as datetimeUtils from '@/utils/datetime'
import type { IWeatherWidgetItem } from './types';
import { defaultWeatherSvgMap } from './assets';
import { unitsHTMLCodeMap } from './enums';
import { formatTemp } from '@/utils/weather';

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

const forecastDays = computed(() => {
  return weatherData.value ? weatherData.value.forecast.slice(0, props.weatherItem.showNumForecastDays) : []
})
</script>


<template>
  <div v-if="weatherData && weatherData.forecast" class="widget-theme-bg widget-theme-text widget-theme-bg flex flex-col w-full py-2 px-4 grow justify-center items-center space-y-2">
    <span v-if="weatherItem.showLocation">{{ weatherLocation?.name }}</span>
    <div
      class="grid w-full"
      :class="{
        'grid-cols-1': weatherItem.showNumForecastDays === 1,
        'grid-cols-2': weatherItem.showNumForecastDays === 2,
        'grid-cols-3': weatherItem.showNumForecastDays === 3,
        'grid-cols-4': weatherItem.showNumForecastDays === 4,
        'grid-cols-5': weatherItem.showNumForecastDays === 5,
        'grid-cols-6': weatherItem.showNumForecastDays === 6,
        'grid-cols-7': weatherItem.showNumForecastDays === 7,
        'grid-cols-8': weatherItem.showNumForecastDays === 8,
      }"
    >
      <div v-for="(day, i) in forecastDays" :key="i" class="flex flex-col items-center justify-between">
        <span class="uppercase text-xs font-bold opacity-50">{{ datetimeUtils.format(day.dt * 1000, "ddd") }}</span>
        <img v-if="weatherItem.showIcon" :src="defaultWeatherSvgMap[day.weather[0].icon]" class="h-12" />
        <div v-if="weatherItem.showTemperature" class="text-center flex flex-row items-center justify-center text-sm">
          <span class="font-bold">
            <span>{{ formatTemp(day.temp.max, weatherItem.units) }}</span>
            <span v-if="weatherItem.showUnits" :innerHTML="unitsHTMLCodeMap[weatherItem.units]"></span>
            <span v-else>&deg;</span>
          </span>
          <span class="opacity-50 mx-0.5">/</span>
          <span class="opacity-70">
            <span>{{ formatTemp(day.temp.min, weatherItem.units) }}</span>
            <span v-if="weatherItem.showUnits" :innerHTML="unitsHTMLCodeMap[weatherItem.units]"></span>
            <span v-else>&deg;</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
