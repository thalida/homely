<script setup lang="ts">
import { DEFAULT_WIDGET_COLOR, EWidgetType } from '@/enums/widget';
import type { IBaseTextWidget } from './types';

const emits = defineEmits<{
  (e: 'widgetMenuBtnClicked', defaultWidget: IBaseTextWidget): void,
}>();

const widgetType = EWidgetType.TEXT;
const defaultWidget: IBaseTextWidget = {
  widget_type: widgetType,
  content: {
    text: "",
    isInteractive: false,
    fontFamily: "Lato",
    fontVariant: "regular",
    fontSize: 16,
    textAlign: "left",
    lineHeight: 1.5,
  },
  card_style: {
    background_color: DEFAULT_WIDGET_COLOR,
  },
  layout: {
    w: 3,
    h: 3,
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
    Text
  </button>
</template>

<style scoped></style>
