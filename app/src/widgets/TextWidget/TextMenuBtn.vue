<script setup lang="ts">
import { DEFAULT_WIDGET_COLOR, EWidgetType } from '@/enums/widget';
import type { IBaseTextWidget } from './types';
import SpaceMenuBtn from '@/components/SpaceMenuBtn.vue';

const defaultWidget: IBaseTextWidget = {
  widget_type: EWidgetType.TEXT,
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
</script>

<template>
  <SpaceMenuBtn :defaultWidget="defaultWidget">
    Text
  </SpaceMenuBtn>
</template>

<style scoped></style>
