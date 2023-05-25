<script setup lang="ts">
import { DEFAULT_WIDGET_COLOR, EWidgetType } from '@/enums/widget';
import { EImageWidgetBackgroundSize, EImageWidgetBackgroundPosition, EImageWidgetBackgroundRepeat } from './enums';
import type { IBaseImageWidget } from './types';

const emits = defineEmits<{
  (e: 'widgetMenuBtnClicked', defaultWidget: IBaseImageWidget): void,
}>();

const widgetType = EWidgetType.IMAGE;
const defaultWidget: IBaseImageWidget = {
  widget_type: widgetType,
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

function handleBtnClick() {
  emits('widgetMenuBtnClicked', defaultWidget);
}
</script>

<template>
  <button @click="handleBtnClick">
    Image
  </button>
</template>

<style scoped></style>
