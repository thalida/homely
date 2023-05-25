<script setup lang="ts">
import { type PropType, watch } from 'vue';
import type { IWeatherWidgetItem } from './types';
import { EWeatherWidgetStyle } from './enums';
import { useWeatherStore } from '@/stores/weather';
import WeatherRowWindow from './WeatherRowWindow.vue';
import WeatherRowCurrent from './WeatherRowCurrent.vue';
import WeatherRowForecast from './WeatherRowForecast.vue';

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

watch(() => props.weatherItem, () => {
  weatherStore.updateWeatherByWigetItem(props.weatherItem)
}, { deep: true })
</script>

<template>
  <WeatherRowWindow
    v-if="weatherItem.style === EWeatherWidgetStyle.WINDOW"
    class="grow"
    :weatherItem="weatherItem"
    :widgetId="widgetId" />
  <WeatherRowCurrent
    v-else-if="weatherItem.style === EWeatherWidgetStyle.CURRENT"
    :weatherItem="weatherItem"
    :widgetId="widgetId" />
  <WeatherRowForecast
    v-else-if="weatherItem.style === EWeatherWidgetStyle.FORECAST"
    :weatherItem="weatherItem"
    :widgetId="widgetId" />
</template>

<style scoped>

</style>
