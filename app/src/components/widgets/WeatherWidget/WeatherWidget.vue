<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watchEffect, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useWeatherStore } from '@/stores/weather';
import { EWeatherWidgetStyle, EWeatherWidgetUnits, type IWeatherItem, type IWeatherWidget } from '@/types/widget'

import GooglePlaceInput from '@/components/GooglePlaceInput.vue';
import WeatherItem from './WeatherItem.vue';
import type { ILocation } from '@/types/location';
import { moveItemInArray } from '@/utils/array';

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
  return widgetStore.getWidgetById(props.widgetId) as IWeatherWidget
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
const unitsSymbolMap = ref({
  [EWeatherWidgetUnits.STANDARD]: 'K',
  [EWeatherWidgetUnits.METRIC]: 'C',
  [EWeatherWidgetUnits.IMPERIAL]: 'F',
} as Record<string, string>)


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

function handleUnitsChange() {
  weatherStore.updateWeatherByWidget(widget.value.uid)
}

function handlePlaceChange(weatherRow: IWeatherItem, location: ILocation) {
  weatherRow.location = location
  weatherStore.updateWeatherByWidget(widget.value.uid)
}

function handleRemoveWeatherItem(e: Event, weatherRow: IWeatherItem, index: number) {
  e.preventDefault()
  widget.value.content.items.splice(index, 1)
}

async function handleAddWeatherItem() {
  if (!widget.value) {
    return
  }


  const showLocation = widget.value.content.items.length === 0 ? true : widget.value.content.items[widget.value.content.items.length - 1].showLocation
  const units = widget.value.content.items.length === 0 ? EWeatherWidgetUnits.METRIC : widget.value.content.items[widget.value.content.items.length - 1].units
  widget.value.content.items.push({
    location: null,
    useCurrentLocation: true,
    fetchedOn: null,
    showNumForecastDays: 5,
    style: EWeatherWidgetStyle.CURRENT,
    units,
    showLocation,
  })

  await weatherStore.updateWeatherByWidget(widget.value.uid)
}

function handleItemMoveUp(e: Event, weatherItem: IWeatherItem, index: number) {
  if (!widget.value) {
    return
  }

  moveItemInArray(widget.value.content.items, index, index - 1)
}

function handleItemMoveDown(e: Event, weatherItem: IWeatherItem, index: number) {
  if (!widget.value) {
    return
  }

  moveItemInArray(widget.value.content.items, index, index + 1)
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex flex-col"
  >
    <template v-if="isReady">
      <WeatherItem
        v-for="(weatherRow, rowI) in widget.content.items"
        :key="rowI"
        class="flex flex-col w-full py-2 px-4 grow justify-center items-center space-y-2"
        :weatherItem="weatherRow"
      />
    </template>
    <template v-else>
      Loading...
    </template>
  </div>
  <teleport to="#space__widget-menu">
    <div v-show="widget.state.selected" class="flex flex-col">
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
          <span>Show City</span>
          <input type="checkbox" v-model="weatherRow.showLocation" />
        </label>
        <label>
          <span>Units</span>
          <select v-model="weatherRow.units" @change="handleUnitsChange">
            <option v-for="unit in supportedUnits" :key="unit" :value="unit">
              {{ unit }} (&deg;{{ unitsSymbolMap[unit] }})
            </option>
          </select>
        </label>
          <div>
            <button v-if="index > 0" @click="handleItemMoveUp($event, weatherRow, index)">Move Up</button>
            <button v-if="index < numWeatherItems - 1" @click="handleItemMoveDown($event, weatherRow, index)">Move Down</button>
          </div>
        <button @click="handleRemoveWeatherItem($event, weatherRow, index)">Remove</button>
      </div>
      <button @click="handleAddWeatherItem">Add</button>
    </div>
  </teleport>
</template>

<style scoped>
</style>
