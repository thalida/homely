<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watchEffect, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useDateTimeStore } from '@/stores/datetime'
import DateTimeCardRow from './DateTimeCardRow.vue';
import type { TDateTimeWidget } from './types';

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const widgetStore = useWidgetStore()
const dateTimeStore = useDateTimeStore()
const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId) as TDateTimeWidget
})
const widgetId = ref<string | null>(null)

watchEffect(() => {
  if (widget.value) {
    widgetId.value = widget.value.uid
  }
})

onMounted(() => {
  if (!widget.value) {
    return
  }

  dateTimeStore.connect(widget.value.uid)
})

onBeforeUnmount(() => {
  if (!widgetId.value) {
    return
  }

  dateTimeStore.disconnect(widgetId.value)
})
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex flex-col">
    <DateTimeCardRow v-for="(datetime, index) in widget.content.items" :key="index" :widgetId="widgetId" :datetime="datetime" />
  </div>
  <teleport to="#space__widget-menu">
    <DateTimeMenuSettings v-if="widgetId" :widgetId="widgetId" />
  </teleport>
</template>

<style scoped>
.scale-text {
  container-type: inline-size;
}
/* fit font to container */
.scale-text * {
  font-size: min(50cqw, 10cqh);
  line-height: 1;
  width: 100%;
  word-wrap: break-word;
}
</style>
