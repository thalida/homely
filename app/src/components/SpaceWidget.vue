<script setup lang="ts">
import { computed } from 'vue'
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
  if (!widget.value) {
    return false
  }
  return widget.value.state ? widget.value.state.selected : false
})

const component = computed(() => {
  if (!widget.value) {
    return null
  }
  return widgetComponents[widget.value.type]
})
</script>

<template>
  <component
    :is="component"
    :widgetId="props.widgetId"
    class="p-4 overflow-auto h-full"
    :class="{
      'bg-blue-100': isSelected,
      'bg-slate-100': !isSelected
    }" />
</template>

<style scoped>
</style>
