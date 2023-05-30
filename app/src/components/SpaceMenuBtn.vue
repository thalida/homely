<script setup lang="ts">
import type { IBaseWidget } from '@/types/widget';
import { computed, onMounted, type PropType } from 'vue';
import { GridStack } from 'gridstack';

const props = defineProps({
  defaultWidget: {
    type: Object as PropType<IBaseWidget>,
    required: true
  }
});

const widgetAsString = computed(() => {
  return JSON.stringify(props.defaultWidget);
});

onMounted(() => {
  GridStack.setupDragIn('.newWidget', { appendTo: 'body', helper: 'clone' });
})
</script>

<template>
  <div class="newWidget grid-stack-item" draggable="true" :gs-w="defaultWidget.layout.w" :gs-h="defaultWidget.layout.h" :data-is-new-widget="true" :data-create-widget="widgetAsString">
    <div class="grid-stack-item-content bg-blue-50">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
