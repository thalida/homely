<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWidgetStore } from '@/stores/widget'

const widgetStore = useWidgetStore()
const widgetRef = ref()

const props = defineProps({
  widgetId: {
    type: String,
    required: true
  }
})

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId)
})
</script>

<template>
  <div
    class="p-4 overflow-auto h-full"
    ref="widgetRef"
    :class="{
      'bg-red-100': widget.state.selected,
      'bg-slate-100': !widget.state.selected
    }"
  >
    {{ widget.content }}
  </div>
</template>

<style scoped>
</style>
