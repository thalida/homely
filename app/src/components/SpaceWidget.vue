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
    class="p-4 overflow-auto h-full" />
</template>

<style scoped>
</style>
