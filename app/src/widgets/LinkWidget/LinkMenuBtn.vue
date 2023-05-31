<script setup lang="ts">
import { DEFAULT_WIDGET_COLOR, EWidgetType } from '@/constants/widget';
import { ELinkWidgetStyle } from './constants';
import type { IBaseLinkWidget } from './types';
import SpaceMenuBtn from '@/components/SpaceMenuBtn.vue';
import { LinkIcon } from 'lucide-vue-next';

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
    <template #icon>
      <LinkIcon class="h-full w-auto" />
    </template>
    <template #label>
      Link
    </template>
  </SpaceMenuBtn>
</template>

<style scoped></style>
