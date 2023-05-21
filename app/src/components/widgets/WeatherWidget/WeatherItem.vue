<script setup lang="ts">
import { computed, ref, type PropType, watch } from 'vue';
import { EWeatherWidgetStyle, type IWeatherWidgetItem } from '@/types/widget'
import { useWeatherStore } from '@/stores/weather';
import {
  SunIcon,
  MoonIcon,
  CloudSunIcon,
  CloudMoonIcon,
  CloudIcon,
  CloudyIcon,
  CloudSunRainIcon,
  CloudMoonRainIcon,
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSnowIcon
} from 'lucide-vue-next';
import * as datetimeUtils from '@/utils/datetime'
import { useLocationStore } from '@/stores/location';

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


const weatherIconMap = ref({
  "01d": SunIcon,
  "01n": MoonIcon,
  "02d": CloudSunIcon,
  "02n": CloudMoonIcon,
  "03d": CloudIcon,
  "03n": CloudIcon,
  "04d": CloudyIcon,
  "04n": CloudyIcon,
  "09d": CloudSunRainIcon,
  "09n": CloudMoonRainIcon,
  "10d": CloudRainIcon,
  "10n": CloudRainIcon,
  "11d": CloudLightningIcon,
  "11n": CloudLightningIcon,
  "13d": CloudSnowIcon,
  "13n": CloudSnowIcon,
  "50d": CloudFogIcon,
  "50n": CloudFogIcon,
} as Record<string, any>)

watch(() => props.weatherItem, () => {
  weatherStore.updateWeatherByWigetItem(props.weatherItem)
}, { deep: true })
</script>

<template>
<div
  class="flex flex-col w-full py-2 px-4 grow justify-center items-center space-y-2"
>
  <template v-if="weatherData && weatherItem.style === EWeatherWidgetStyle.CURRENT && weatherData.currently">
    <div class="flex flex-row justify-between items-center w-full text-sm">
      <span class="capitalize">
        {{ weatherData.currently.weather[0].description }}
      </span>
      <span v-if="weatherItem.showLocation">{{ weatherLocation?.name }}</span>
    </div>
    <div class="flex flex-row justify-between items-center w-full">
      <div class="flex flex-row text-2xl font-bold">
        {{ Math.round(weatherData.currently.temp) }}&deg;
      </div>
      <component :is="weatherIconMap[weatherData.currently.weather[0].icon]" class="h-full w-auto max-h-16" />
    </div>
  </template>
  <template v-else-if="weatherData && weatherItem.style === EWeatherWidgetStyle.FORECAST && weatherData.forecast">
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
      <div v-for="(day, i) in forecastDays" :key="i" class="flex flex-col items-center justify-between space-y-2">
        <span class="uppercase text-xs font-bold opacity-50">{{ datetimeUtils.format(day.dt * 1000, "ddd") }}</span>
        <component :is="weatherIconMap[day.weather[0].icon]" class="h-auto w-full max-h-6" />
        <div class="text-center flex flex-col items-center justify-center">
          <span class="font-bold">{{ Math.round(day.temp.max) }}&deg;</span>
          <span class="opacity-50">{{ Math.round(day.temp.min) }}&deg;</span>
        </div>
      </div>
    </div>
  </template>
</div>
</template>

<style scoped>

</style>
