<script setup lang="ts">
import { DEFAULT_WIDGET_COLOR, EWidgetType } from '@/constants/widget';
import { ELinkWidgetStyle } from './enums';
import type { IBaseLinkWidget } from './types';
import SpaceMenuBtn from '@/components/SpaceMenuBtn.vue';

const defaultWidget: IBaseLinkWidget = {
  widget_type: EWidgetType.LINK,
  content: {
    url: null,
    style: ELinkWidgetStyle.FLAG,
    showIcon: true,
    showImage: true,
    showUrl: true,
    showTitle: true,
    showDescription: true,
    metadata: {},
    showCustomMetadata: false,
  },
  card_style: {
    background_color: DEFAULT_WIDGET_COLOR,
  },
  layout: {
    w: 3,
    h: 2,
    isResizable: true,
    preserveAspectRatio: false,
  },
  link: null,
  original_link: null,
};
</script>

<template>
  <SpaceMenuBtn :defaultWidget="defaultWidget">
    Link
  </SpaceMenuBtn>
</template>

<style scoped></style>
