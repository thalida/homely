<script setup lang="ts">
import type { IBaseWidget } from '@/types/widget';
import { computed, onMounted, type Ref, inject, type PropType } from 'vue';
import type GridStackVue from './GridStack.vue'
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

const gridStackRef = inject('gridStackRef') as Ref<InstanceType<typeof GridStackVue>>;
const numGridCols = computed(() => {
  return gridStackRef.value?.getGrid()?.getColumn() ?? 12;
});
const numGridColsClass = computed(() => {
  return `gs-${numGridCols.value}`;
});
const gridMargin = computed(() => {
  return gridStackRef.value?.getGrid()?.getMargin() ?? 12;
});

onMounted(() => {
  console.log('gridStackRef', gridStackRef.value.getGrid())
  GridStack.setupDragIn(".space-menu-btn", { appendTo: 'body', helper: 'clone', scroll: true });
})
</script>

<template>
  <div
    class="space-menu-btn grid-stack-item relative"
    draggable="true"
    :gs-w="defaultWidget.layout.w"
    :gs-h="defaultWidget.layout.h"
    :data-is-new-widget="true"
    :data-create-widget="widgetAsString"
  >
    <div class="menu-tile bg-blue-50 h-full w-full flex flex-col justify-center items-center space-y-2 p-2">
      <div class="h-6 w-auto">
        <slot name="icon"></slot>
      </div>

      <span class="text-sm text-center">
        <slot name="label"></slot>
      </span>
    </div>

    <div class="ghost absolute top-0 left-0 w-screen h-screen gs-id-0" :class="[numGridColsClass]">
      <div
        class="grid-stack-item"
        :gs-w="defaultWidget.layout.w"
        :gs-h="defaultWidget.layout.h"
      >
        <div class="h-full w-full" :style="{
          padding: gridMargin + 'px',
        }">
          <SpaceWidget :isPlaceholder="true" :placeholderWidget="defaultWidget" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.space-menu-btn:not(.ui-draggable-dragging)  {
  .ghost {
    display: none;
  }
}
.space-menu-btn.ui-draggable-dragging {
  .menu-tile {
    display: none;
  }
}
</style>
