<script setup lang="ts">
import { type PropType, watch } from 'vue';
import { EWeatherWidgetStyle, type IWeatherWidgetItem } from '@/types/widget'
import { useWeatherStore } from '@/stores/weather';
import WeatherItemWindow from './WeatherItemWindow.vue';
import WeatherItemCurrent from './WeatherItemCurrent.vue';
import WeatherItemForecast from './WeatherItemForecast.vue';

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
  <WeatherItemWindow
    v-if="weatherItem.style === EWeatherWidgetStyle.WINDOW"
    class="grow"
    :weatherItem="weatherItem"
    :widgetId="widgetId" />
  <WeatherItemCurrent
    v-else-if="weatherItem.style === EWeatherWidgetStyle.CURRENT"
    :weatherItem="weatherItem"
    :widgetId="widgetId" />
  <WeatherItemForecast
    v-else-if="weatherItem.style === EWeatherWidgetStyle.FORECAST"
    :weatherItem="weatherItem"
    :widgetId="widgetId" />
</template>

<style scoped>

</style>
