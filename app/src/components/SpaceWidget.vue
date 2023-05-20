<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import {  widgetComponents } from './widgets'

const widgetStore = useWidgetStore()

const props = defineProps({
  widgetId: {
    type: String,
    required: true
  }
})

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId)
})

const isSelected = computed(() => {
  return widget.value ? widget.value.state.selected : false;
})

const component = computed(() => {
  if (!widget.value) {
    return null
  }
  return widgetComponents[widget.value.widget_type]
})
</script>

<template>
  <component
    :is="component"
    :widgetId="props.widgetId"
    class="rounded-2xl w-full h-full overflow-auto bg-slate-100"
    :class="{
      'ring-2 ring-pink-500': isSelected,
    }"
  />
</template>

<style scoped>
</style>
