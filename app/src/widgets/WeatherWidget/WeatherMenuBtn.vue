<script setup lang="ts">
import { DEFAULT_WIDGET_COLOR, EWidgetType } from '@/constants/widget';
import type { IBaseWeatherWidget } from './types';
import { EWeatherWidgetStyle, EWeatherWidgetUnits } from './constants';
import SpaceMenuBtn from '@/components/SpaceMenuBtn.vue';

const defaultWidget: IBaseWeatherWidget = {
  widget_type: EWidgetType.WEATHER,
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
</script>

<template>
  <SpaceMenuBtn :defaultWidget="defaultWidget">
    Weather
  </SpaceMenuBtn>
</template>

<style scoped></style>
