<script setup lang="ts">
import { type PropType, watch } from 'vue';
import { EWeatherWidgetStyle, type IWeatherWidgetItem } from '@/types/widget'
import { useWeatherStore } from '@/stores/weather';
import WeatherWindow from './WeatherWindow.vue';
import WeatherCurrent from './WeatherCurrent.vue';
import WeatherForecast from './WeatherForecast.vue';

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
  <WeatherWindow
    v-if="weatherItem.style === EWeatherWidgetStyle.WINDOW"
    class="grow"
    :weatherItem="weatherItem"
    :widgetId="widgetId" />
  <WeatherCurrent
    v-else-if="weatherItem.style === EWeatherWidgetStyle.CURRENT"
    :weatherItem="weatherItem"
    :widgetId="widgetId" />
  <WeatherForecast
    v-else-if="weatherItem.style === EWeatherWidgetStyle.FORECAST"
    :weatherItem="weatherItem"
    :widgetId="widgetId" />
</template>

<style scoped>

</style>
