<script setup lang="ts">
import type { IBaseWidget } from '@/types/widget';
import type { PropType } from 'vue';


const props = defineProps({
  defaultWidget: {
    type: Object as PropType<IBaseWidget>,
    required: true
  }
});

const emits = defineEmits<{
  (e: 'widgetMenuBtnClicked', defaultWidget: IBaseWidget): void,
}>();

function handleBtnClick() {
  emits('widgetMenuBtnClicked', props.defaultWidget);
}
</script>

<template>
  <button @click="handleBtnClick">
    <slot></slot>
  </button>
</template>

<style scoped></style>
