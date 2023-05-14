<script setup lang="ts">
import { computed } from 'vue'
import { useWidgetStore } from '@/stores/widget'

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const widgetStore = useWidgetStore()
const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId)
})

</script>

<template>
  <div>

  </div>
</template>

<style scoped>

</style>
