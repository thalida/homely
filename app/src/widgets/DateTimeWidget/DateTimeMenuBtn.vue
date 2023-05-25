<script setup lang="ts">
import { DEFAULT_WIDGET_COLOR, EWidgetType } from '@/enums/widget';
import type { IBaseDateTimeWidget } from './types';

const emits = defineEmits<{
  (e: 'widgetMenuBtnClicked', defaultWidget: IBaseDateTimeWidget): void,
}>();

const widgetType = EWidgetType.DATETIME;
const defaultWidget: IBaseDateTimeWidget = {
  widget_type: widgetType,
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

function handleBtnClick() {
  emits('widgetMenuBtnClicked', defaultWidget);
}
</script>

<template>
  <button @click="handleBtnClick">
    Date Time
  </button>
</template>

<style scoped></style>
