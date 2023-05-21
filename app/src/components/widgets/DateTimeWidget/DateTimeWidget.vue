<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watchEffect, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useDateTimeStore } from '@/stores/datetime'
import type { IDateTime, IDateTimeWidget } from '@/types/widget'
import DateTimeItem from './DateTimeItem.vue';
import { moveItemInArray } from '@/utils/array';

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
const numDateTimeItems = computed(() => {
  return widget.value ? widget.value.content.datetimes.length : 0
})

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

  const defaults = {
    timezone: null,
    useLocalTime: true,
    showIsLocalTimeLabel: true,
    formatLine1: "h:mm A",
    formatLine2: "dddd, MMMM D",
    showCity: true,
    showLine1: true,
    showLine2: true,
    showDynamicIcon: true,
    showDynamicBackground: true,
  }

  const copyFrom = widget.value.content.datetimes.length > 0 ? widget.value.content.datetimes[widget.value.content.datetimes.length - 1] : defaults
  const newDatetime = Object.assign({}, copyFrom)
  newDatetime.timezone = null
  newDatetime.useLocalTime = true

  widget.value.content.datetimes.push(newDatetime)
}

function handleRemoveDateTime(e: Event, datetime: IDateTime, index: number) {
  if (!widget.value) {
    return
  }

  widget.value.content.datetimes.splice(index, 1)
}

function handleDateTimeMoveUp(e: Event, datetime: IDateTime, index: number) {
  if (!widget.value) {
    return
  }

  moveItemInArray(widget.value.content.datetimes, index, index - 1)
}

function handleDateTimeMoveDown(e: Event, datetime: IDateTime, index: number) {
  if (!widget.value) {
    return
  }

  moveItemInArray(widget.value.content.datetimes, index, index + 1)
}

</script>

<template>
  <div
    v-bind="$attrs"
    class="flex flex-col">
    <DateTimeItem v-for="(datetime, index) in widget.content.datetimes" :key="index" :widgetId="widgetId" :datetime="datetime" />
  </div>
  <teleport to="#space__widget-menu">
    <div v-if="widget.state.selected">
      <div v-for="(datetime, index) in widget.content.datetimes" :key="index" class="flex flex-col">
        <label>
          <span>Use Local Time</span>
          <input type="checkbox" v-model="datetime.useLocalTime" @change="onChangeUseLocalTime($event, datetime)" />
        </label>
        <label v-if="datetime.useLocalTime">
          <span>Show Is Local Time Label</span>
          <input type="checkbox" v-model="datetime.showIsLocalTimeLabel" />
        </label>
        <label v-if="!datetime.useLocalTime">
          <span>Timezone</span>
          <select v-model="datetime.timezone">
            <option v-for="timezone in dateTimeStore.supportedTimezones" :key="timezone" :value="timezone">{{ timezone }}</option>
          </select>
        </label>
        <label>
          <span>Show City</span>
          <input type="checkbox" v-model="datetime.showCity" />
        </label>
        <label>
          <span>Show Line 1</span>
          <input type="checkbox" v-model="datetime.showLine1" />
        </label>
        <label v-if="datetime.showLine1">
          <span>Format Line 1</span>
          <input type="text" v-model="datetime.formatLine1" />
        </label>
        <label>
          <span>Show Line 2</span>
          <input type="checkbox" v-model="datetime.showLine2" />
        </label>
        <label v-if="datetime.showLine2">
          <span>Format Line 2</span>
          <input type="text" v-model="datetime.formatLine2" />
        </label>
        <label>
          <span>Show Dynamic Icon</span>
          <input type="checkbox" v-model="datetime.showDynamicIcon" />
        </label>
        <label>
          <span>Show Dynamic Background</span>
          <input type="checkbox" v-model="datetime.showDynamicBackground" />
        </label>
        <div>
          <button v-if="index > 0" @click="handleDateTimeMoveUp($event, datetime, index)">Move Up</button>
          <button v-if="index < numDateTimeItems - 1" @click="handleDateTimeMoveDown($event, datetime, index)">Move Down</button>
        </div>
        <button @click="handleRemoveDateTime($event, datetime, index)">Remove</button>
      </div>
      <div>
        <button @click="handleAddDateTime">Add</button>
      </div>
    </div>
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
