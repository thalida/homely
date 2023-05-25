<script setup lang="ts">
import { DEFAULT_WIDGET_COLOR, EWidgetType } from '@/enums/widget';
import type { IBaseWeatherWidget } from './types';
import { EWeatherWidgetStyle, EWeatherWidgetUnits } from './enums';

const emits = defineEmits<{
  (e: 'widgetMenuBtnClicked', defaultWidget: IBaseWeatherWidget): void,
}>();

const widgetType = EWidgetType.WEATHER;
const defaultWidget: IBaseWeatherWidget = {
  widget_type: widgetType,
  content: {
    items: [
      {
        style: EWeatherWidgetStyle.CURRENT,
        units: EWeatherWidgetUnits.METRIC,
        location: null,
        useCurrentLocation: true,
        showLocation: true,
        showNumForecastDays: 5,
        showTemperature: true,
        showUnits: false,
        showIcon: true,
        showDescription: true,
        showTime: true,
      },
    ],
  },
  card_style: {
    background_color: DEFAULT_WIDGET_COLOR,
  },
  layout: {
    w: 3,
    h: 1,
    isResizable: true,
    preserveAspectRatio: false,
  },
};

function handleBtnClick() {
  emits('widgetMenuBtnClicked', defaultWidget);
}
</script>

<template>
  <button @click="handleBtnClick">
    Weather
  </button>
</template>

<style scoped></style>
