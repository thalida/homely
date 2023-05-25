<script setup lang="ts">
import { useDateTimeStore } from '@/stores/datetime';
import { useWidgetStore } from '@/stores/widget';
import type { ILocation } from '@/types/location';
import { moveItemInArray } from '@/utils/array';
import { computed } from 'vue';
import type { TDateTimeWidget, IDateTime } from './types';


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
const numDateTimeItems = computed(() => {
  return widget.value ? widget.value.content.items.length : 0
})

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
  }

  const copyFrom = widget.value.content.items.length > 0 ? widget.value.content.items[widget.value.content.items.length - 1] : defaults
  const newDatetime = Object.assign({}, copyFrom)
  newDatetime.location = null
  newDatetime.timezone = null
  newDatetime.useCurrentLocation = true

  widget.value.content.items.push(newDatetime)
}
</script>

<template>
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
</template>

<style scoped>

</style>
