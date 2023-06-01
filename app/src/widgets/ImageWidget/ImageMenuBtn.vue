<script setup lang="ts">
import { EWidgetType } from '@/constants/widget';
import { DEFAULT_WIDGET_COLOR } from '@/constants/theme';
import { EImageWidgetBackgroundSize, EImageWidgetBackgroundPosition, EImageWidgetBackgroundRepeat } from './constants';
import type { IBaseImageWidget } from './types';
import SpaceMenuBtn from '@/components/SpaceMenuBtn.vue';
import { ImageIcon } from 'lucide-vue-next';

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
    <template #icon>
      <ImageIcon class="h-full w-auto" />
    </template>
    <template #label>
      Image
    </template>
  </SpaceMenuBtn>
</template>

<style scoped></style>
