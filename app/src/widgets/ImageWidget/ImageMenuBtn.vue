<script setup lang="ts">
import { DEFAULT_WIDGET_COLOR, EWidgetType } from '@/enums/widget';
import { EImageWidgetBackgroundSize, EImageWidgetBackgroundPosition, EImageWidgetBackgroundRepeat } from './enums';
import type { IBaseImageWidget } from './types';
import SpaceMenuBtn from '@/components/SpaceMenuBtn.vue';

const defaultWidget: IBaseImageWidget = {
  widget_type: EWidgetType.IMAGE,
  content: {
    url: null,
    backgroundSize: EImageWidgetBackgroundSize.COVER,
    backgroundPosition: EImageWidgetBackgroundPosition.CENTER,
    backgroundRepeat: EImageWidgetBackgroundRepeat.NO_REPEAT,
  },
  card_style: {
    background_color: DEFAULT_WIDGET_COLOR,
  },
  layout: {
    w: 2,
    h: 2,
    isResizable: true,
    preserveAspectRatio: false,
  },
};
</script>

<template>
  <SpaceMenuBtn :defaultWidget="defaultWidget">
    Image
  </SpaceMenuBtn>
</template>

<style scoped></style>
