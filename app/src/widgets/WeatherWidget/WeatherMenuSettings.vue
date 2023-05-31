<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watchEffect, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useWeatherStore } from '@/stores/weather';
import type { ILocation } from '@/types/location';
import { moveItemInArray } from '@/utils/array';
import GooglePlaceInput from '@/components/GooglePlaceInput.vue';
import { EWeatherWidgetStyle, EWeatherWidgetUnits, unitsSymbolMap } from './constants'
import type { IWeatherWidgetItem, TWeatherWidget } from './types';


const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const isReady = ref(false)
const widgetStore = useWidgetStore()
const weatherStore = useWeatherStore()
const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId) as TWeatherWidget
})
const widgetId = ref<string | null>(null)

const numWeatherItems = computed(() => {
  return widget.value ? widget.value.content.items.length : 0
})
const supportedUnits = computed(() => {
  return Object.values(EWeatherWidgetUnits)
})
const supportedStyles = computed(() => {
  return Object.values(EWeatherWidgetStyle)
})


watchEffect(() => {
  if (widget.value) {
    widgetId.value = widget.value.uid
  }
})

onMounted(async () => {
  if (!widget.value) {
    return
  }

  await weatherStore.connect(widget.value.uid)
  isReady.value = true
})

onBeforeUnmount(() => {
  if (!widgetId.value) {
    return
  }

  weatherStore.disconnect(widgetId.value)
})

function handlePlaceChange(weatherRow: IWeatherWidgetItem, location: ILocation) {
  weatherRow.location = location
}

function handleRemoveWeatherItem(e: Event, weatherRow: IWeatherWidgetItem, index: number) {
  e.preventDefault()
  widget.value.content.items.splice(index, 1)
}

async function handleAddWeatherItem() {
  if (!widget.value) {
    return
  }

  const defaultItem: IWeatherWidgetItem = {
    location: null,
    useCurrentLocation: true,
    showNumForecastDays: 5,
    style: EWeatherWidgetStyle.CURRENT,
    units: EWeatherWidgetUnits.METRIC,
    showLocation: true,
    showTemperature: true,
    showUnits: false,
    showIcon: true,
    showDescription: true,
    showTime: true
  }

  const lastItem = widget.value.content.items.length > 0 ? widget.value.content.items[widget.value.content.items.length - 1] : {}
  const newWidget = Object.assign({}, defaultItem, lastItem)

  widget.value.content.items.push(newWidget)

  await weatherStore.updateWeatherByWidget(widget.value.uid)
}

function handleItemMoveUp(e: Event, weatherItem: IWeatherWidgetItem, index: number) {
  if (!widget.value) {
    return
  }

  moveItemInArray(widget.value.content.items, index, index - 1)
}

function handleItemMoveDown(e: Event, weatherItem: IWeatherWidgetItem, index: number) {
  if (!widget.value) {
    return
  }

  moveItemInArray(widget.value.content.items, index, index + 1)
}
</script>

<template>
  <div v-if="widget.state.selected" class="flex flex-col">
    <div v-for="(weatherRow, index) in widget.content.items" :key="index" class="flex flex-col">
      <label>
        <span>Style</span>
        <select v-model="weatherRow.style">
          <option v-for="style in supportedStyles" :key="style" :value="style">
            {{ style }}
          </option>
        </select>
      </label>
      <label v-if="weatherRow.style === EWeatherWidgetStyle.FORECAST">
        <span>Num Forecast Days</span>
        <input type="number" v-model.number="weatherRow.showNumForecastDays" min="1" max="8" step="1" />
      </label>
      <label>
        <span>Use Current Location</span>
        <input type="checkbox" v-model="weatherRow.useCurrentLocation" />
      </label>
      <label v-if="!weatherRow.useCurrentLocation">
        <span>Location</span>
        <GooglePlaceInput :place="weatherRow.location" @change="(location) => handlePlaceChange(weatherRow, location)" />
      </label>
      <label>
        <span>Show Location</span>
        <input type="checkbox" v-model="weatherRow.showLocation" />
      </label>
      <label v-if="weatherRow.style !== EWeatherWidgetStyle.FORECAST">
        <span>Show Temperature</span>
        <input type="checkbox" v-model="weatherRow.showTemperature" />
      </label>
      <label v-if="weatherRow.showTemperature">
        <span>Show Units</span>
        <input type="checkbox" v-model="weatherRow.showUnits" />
      </label>
      <label v-if="weatherRow.showTemperature">
        <span>Units</span>
        <select v-model="weatherRow.units">
          <option v-for="unit in supportedUnits" :key="unit" :value="unit">
            {{ unit }} ({{ unitsSymbolMap[unit] }})
          </option>
        </select>
      </label>
      <label v-if="weatherRow.style !== EWeatherWidgetStyle.WINDOW">
        <span>Show Icon</span>
        <input type="checkbox" v-model="weatherRow.showIcon" />
      </label>
      <label v-if="weatherRow.style !== EWeatherWidgetStyle.FORECAST">
        <span>Show Description</span>
        <input type="checkbox" v-model="weatherRow.showDescription" />
      </label>
      <label v-if="weatherRow.style === EWeatherWidgetStyle.WINDOW">
        <span>Show Time</span>
        <input type="checkbox" v-model="weatherRow.showTime" />
      </label>
      <div>
        <button v-if="index > 0" @click="handleItemMoveUp($event, weatherRow, index)">Move Up</button>
        <button v-if="index < numWeatherItems - 1" @click="handleItemMoveDown($event, weatherRow, index)">Move Down</button>
      </div>
      <button @click="handleRemoveWeatherItem($event, weatherRow, index)">Remove</button>
    </div>
    <button @click="handleAddWeatherItem">Add</button>
  </div>
</template>

<style scoped>
</style>
