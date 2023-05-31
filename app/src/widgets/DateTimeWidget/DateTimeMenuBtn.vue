<script setup lang="ts">
import { DEFAULT_WIDGET_COLOR, EWidgetType } from '@/constants/widget';
import type { IBaseDateTimeWidget } from './types';
import SpaceMenuBtn from '@/components/SpaceMenuBtn.vue';

const defaultWidget: IBaseDateTimeWidget = {
  widget_type: EWidgetType.DATETIME,
  content: {
    items: [
      {
        location: null,
        timezone: null,
        useCurrentLocation: true,
        formatLine1: "h:mm A",
        formatLine2: "dddd, MMMM D",
        showLocation: true,
        showLine1: true,
        showLine2: true,
        showDynamicIcon: true,
        showDynamicBackground: true,
      }
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
    Date Time
  </SpaceMenuBtn>
</template>

<style scoped></style>
