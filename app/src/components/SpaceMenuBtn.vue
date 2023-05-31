<script setup lang="ts">
import type { IBaseWidget } from '@/types/widget';
import { computed, onMounted, ref, type PropType } from 'vue';
import { GridStack } from 'gridstack';
import SpaceWidget from './SpaceWidget.vue';

const props = defineProps({
  defaultWidget: {
    type: Object as PropType<IBaseWidget>,
    required: true
  },
});

const widgetAsString = computed(() => {
  return JSON.stringify(props.defaultWidget);
});

onMounted(() => {
  GridStack.setupDragIn(".space-menu-btn", { appendTo: 'body', helper: 'clone', scroll: true });
})
</script>

<template>
  <div
    class="space-menu-btn grid-stack-item"
    draggable="true"
    :gs-w="defaultWidget.layout.w"
    :gs-h="defaultWidget.layout.h"
    :data-is-new-widget="true"
    :data-create-widget="widgetAsString"
  >
    <div class="grid-stack-item-content w-full h-full">

      <div class="space-menu-btn__tile bg-blue-50 h-full w-full flex flex-col justify-center items-center space-y-2 p-2">
        <div class="h-6 w-auto">
          <slot name="icon"></slot>
        </div>

        <span class="text-sm text-center">
          <slot name="label"></slot>
        </span>
      </div>
      <SpaceWidget :isPlaceholder="true" :placeholderWidget="defaultWidget" />
    </div>
  </div>
</template>

<style>
.space-menu-btn:not(.ui-draggable-dragging)  {
  .space-widget {
    display: none;
  }
}
.space-menu-btn.ui-draggable-dragging {
  .space-menu-btn__tile {
    display: none;
  }
}
</style>
