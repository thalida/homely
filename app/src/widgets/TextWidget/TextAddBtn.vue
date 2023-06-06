<script setup lang="ts">
import { EWidgetType } from '@/constants/widget';
import { DEFAULT_WIDGET_COLOR } from '@/constants/theme';
import type { IBaseTextWidget } from './types';
import SpaceWidgetAddBtn from '@/components/SpaceWidgetAddBtn.vue';
import { TextIcon } from 'lucide-vue-next';

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
  <SpaceWidgetAddBtn :defaultWidget="defaultWidget">
    <template #icon>
      <TextIcon class="h-full w-auto" />
    </template>
    <template #label>
      Text
    </template>
  </SpaceWidgetAddBtn>
</template>

<style scoped></style>
