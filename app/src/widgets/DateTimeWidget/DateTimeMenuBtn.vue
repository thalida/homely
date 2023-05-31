<script setup lang="ts">
import { DEFAULT_WIDGET_COLOR, EWidgetType } from '@/constants/widget';
import type { IBaseDateTimeWidget } from './types';
import SpaceMenuBtn from '@/components/SpaceMenuBtn.vue';
import { CalendarClockIcon } from 'lucide-vue-next';
import DateTimeCard from './DateTimeCard.vue';

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
    <template #icon>
      <CalendarClockIcon class="h-full w-auto" />
    </template>
    <template #label>
      Date &amp; Time
    </template>
  </SpaceMenuBtn>
</template>

<style scoped></style>
