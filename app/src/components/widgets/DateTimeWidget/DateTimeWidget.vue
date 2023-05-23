<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watchEffect, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useDateTimeStore } from '@/stores/datetime'
import type { IDateTime, IDateTimeWidget } from '@/types/widget'
import DateTimeItem from './DateTimeItem.vue';
import { moveItemInArray } from '@/utils/array';
import type { ILocation } from '@/types/location';
import GooglePlaceInput from '@/components/GooglePlaceInput.vue';

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
  return widget.value ? widget.value.content.items.length : 0
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

function handleAddDateTime() {
  if (!widget.value) {
    return
  }

  const defaults = {
    location: null,
    timezone: null,
    useCurrentLocation: true,
    formatLine1: "h:mm A",
    formatLine2: "dddd, MMMM D",
    showLocation: true,
    showLine1: true,
    showLine2: true,
    showDynamicIcon: true,
    showDynamicBackground: true,
    useRealisticGradient: false,
  }

  const copyFrom = widget.value.content.items.length > 0 ? widget.value.content.items[widget.value.content.items.length - 1] : defaults
  const newDatetime = Object.assign({}, copyFrom)
  newDatetime.location = null
  newDatetime.timezone = null
  newDatetime.useCurrentLocation = true

  widget.value.content.items.push(newDatetime)
}

function handleRemoveDateTime(e: Event, datetime: IDateTime, index: number) {
  if (!widget.value) {
    return
  }

  widget.value.content.items.splice(index, 1)
}

function handleItemMoveUp(e: Event, datetime: IDateTime, index: number) {
  if (!widget.value) {
    return
  }

  moveItemInArray(widget.value.content.items, index, index - 1)
}

function handleItemMoveDown(e: Event, datetime: IDateTime, index: number) {
  if (!widget.value) {
    return
  }

  moveItemInArray(widget.value.content.items, index, index + 1)
}

async function handlePlaceChange(datetime: IDateTime, location: ILocation) {
  const timezone = await dateTimeStore.getTimezone(location)

  if (!timezone) {
    return
  }

  datetime.location = location
  datetime.timezone = timezone
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex flex-col">
    <DateTimeItem v-for="(datetime, index) in widget.content.items" :key="index" :widgetId="widgetId" :datetime="datetime" />
  </div>
  <teleport to="#space__widget-menu">
    <div v-if="widget.state.selected">
      <div v-for="(datetime, index) in widget.content.items" :key="index" class="flex flex-col">
        <label>
          <span>Use Local Time</span>
          <input type="checkbox" v-model="datetime.useCurrentLocation" />
        </label>
        <label v-if="!datetime.useCurrentLocation">
          <span>Location</span>
          <GooglePlaceInput :place="datetime.location" @change="(location: ILocation) => handlePlaceChange(datetime, location)" />
        </label>
        <label>
          <span>Show Location</span>
          <input type="checkbox" v-model="datetime.showLocation" />
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
        <label v-if="datetime.showDynamicBackground">
          <span>Use Realstic Gradient</span>
          <input type="checkbox" v-model="datetime.useRealisticGradient" />
        </label>
        <div>
          <button v-if="index > 0" @click="handleItemMoveUp($event, datetime, index)">Move Up</button>
          <button v-if="index < numDateTimeItems - 1" @click="handleItemMoveDown($event, datetime, index)">Move Down</button>
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
