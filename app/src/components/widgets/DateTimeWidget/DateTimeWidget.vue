<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watchEffect, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useDateTimeStore } from '@/stores/datetime'
import type { IDateTime, IDateTimeWidget } from '@/types/widget'

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
  return widgetStore.getWidgetById(props.widgetId) as IDateTimeWidget
})
const widgetId = ref<string | null>(null)

watchEffect(() => {
  if (widget.value) {
    widgetId.value = widget.value.id
  }
})

onMounted(() => {
  if (!widget.value) {
    return
  }

  dateTimeStore.connect(widget.value.id)
})

onBeforeUnmount(() => {
  if (!widgetId.value) {
    return
  }

  dateTimeStore.disconnect(widgetId.value)
})

function onChangeUseLocalTime(e: Event, datetime: IDateTime) {
  if (datetime.useLocalTime) {
    datetime.timezone = null
  } else {
    datetime.timezone = dateTimeStore.localTimezone
  }
}

function handleAddDateTime() {
  if (!widget.value) {
    return
  }

  widget.value.content.datetimes.push({
    format: 'YYYY-MM-DD HH:mm:ss',
    useLocalTime: true,
    timezone: null
  })
}

function handleRemoveDateTime(e: Event, datetime: IDateTime, index: number) {
  if (!widget.value) {
    return
  }

  widget.value.content.datetimes.splice(index, 1)
}

</script>

<template>
  <div>
    <div v-for="(datetime, index) in widget.content.datetimes" :key="index">
      {{ dateTimeStore.format(datetime) }}
    </div>
  </div>
  <teleport to="#space__widget-menu">
    <div v-if="widget.state.selected">
      <div v-for="(datetime, index) in widget.content.datetimes" :key="index">
        <label>
          <span>Format</span>
          <input type="text" v-model="datetime.format" />
        </label>
        <label>
          <span>Use Local Time</span>
          <input type="checkbox" v-model="datetime.useLocalTime" @change="onChangeUseLocalTime($event, datetime)" />
        </label>
        <label v-if="!datetime.useLocalTime">
          <span>Timezone</span>
          <select v-model="datetime.timezone">
            <option v-for="timezone in dateTimeStore.supportedTimezones" :key="timezone" :value="timezone">{{ timezone }}</option>
          </select>
        </label>
        <button @click="handleRemoveDateTime($event, datetime, index)">Remove</button>
      </div>
      <div>
        <button @click="handleAddDateTime">Add</button>
      </div>
    </div>
  </teleport>
</template>

<style scoped>

</style>
