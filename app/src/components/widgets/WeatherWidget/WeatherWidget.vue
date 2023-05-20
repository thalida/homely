<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watchEffect, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useWeatherStore } from '@/components/widgets/WeatherWidget/weatherStore';
import { EWeatherWidgetStyle, EWeatherWidgetUnits, type IWeatherItem, type IWeatherWidget } from '@/types/widget'
import {
  SunIcon,
  MoonIcon,
  CloudSunIcon,
  CloudMoonIcon,
  CloudIcon,
  CloudyIcon,
  CloudSunRainIcon,
  CloudMoonRainIcon,
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSnowIcon
} from 'lucide-vue-next';
import PlaceInput from './PlaceInput.vue';
import * as datetimeUtils from '@/utils/datetime'

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const weatherIconMap = ref({
  "01d": SunIcon,
  "01n": MoonIcon,
  "02d": CloudSunIcon,
  "02n": CloudMoonIcon,
  "03d": CloudIcon,
  "03n": CloudIcon,
  "04d": CloudyIcon,
  "04n": CloudyIcon,
  "09d": CloudSunRainIcon,
  "09n": CloudMoonRainIcon,
  "10d": CloudRainIcon,
  "10n": CloudRainIcon,
  "11d": CloudLightningIcon,
  "11n": CloudLightningIcon,
  "13d": CloudSnowIcon,
  "13n": CloudSnowIcon,
  "50d": CloudFogIcon,
  "50n": CloudFogIcon,
} as Record<string, any>)

const widgetStore = useWidgetStore()
const weatherStore = useWeatherStore()
const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId) as IWeatherWidget
})
const widgetId = ref<string | null>(null)

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

const forecastDays = computed(() => {
  if (!widget.value) {
    return []
  }

  return widget.value.content.items.map((item) => {
    if (!item.forecast) {
      return []
    }

    return item.forecast.slice(0, item.showNumForecastDays)
  })
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
})

onBeforeUnmount(() => {
  if (!widgetId.value) {
    return
  }

  weatherStore.disconnect(widgetId.value)
})

function handleUnitsChange() {
  weatherStore.updateWeather(widget.value.uid)
}

function handlePlaceChange(weatherRow: IWeatherItem, place: google.maps.places.PlaceResult) {
  if (!place.geometry || !place.geometry.location) {
    return;
  }

  weatherRow.place = {
    name: place.name || "Unknown",
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
  }

  weatherStore.updateWeather(widget.value.uid)
}

function handleRemoveWeatherItem(e: Event, weatherRow: IWeatherItem, index: number) {
  e.preventDefault()
  widget.value.content.items.splice(index, 1)
}

async function handleAddWeatherItem() {
  if (!widget.value) {
    return
  }


  const units = widget.value.content.items.length > 0 ? widget.value.content.items[widget.value.content.items.length - 1].units : EWeatherWidgetUnits.METRIC
  widget.value.content.items.push({
    place: null,
    currently: null,
    forecast: null,
    useCurrentLocation: true,
    units,
    fetchedOn: null,
    showNumForecastDays: 5,
    style: EWeatherWidgetStyle.CURRENT,
  })

  await weatherStore.updateWeather(widget.value.uid)
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex flex-col"
  >
    <div
      v-for="(weatherRow, rowI) in widget.content.items"
      :key="rowI"
      class="flex flex-col w-full py-2 px-4 grow justify-center items-center space-y-2"
    >
      <template v-if="weatherRow.style === EWeatherWidgetStyle.CURRENT && weatherRow.currently">
        <div class="flex flex-row justify-between items-center w-full text-sm">
          <span class="capitalize">
            {{ weatherRow.currently.weather[0].description }}
          </span>
          <span>{{ weatherRow.place?.name }}</span>
        </div>
        <div class="flex flex-row justify-between items-center w-full">
          <div class="flex flex-row text-2xl font-bold">
            {{ weatherRow.currently.temp }}&deg;
          </div>
          <component :is="weatherIconMap[weatherRow.currently.weather[0].icon]" class="h-full w-auto max-h-16" />
        </div>
      </template>
      <template v-else-if="weatherRow.style === EWeatherWidgetStyle.FORECAST && weatherRow.forecast">
        <span>{{ weatherRow.place?.name }}</span>
        <div
          class="grid w-full"
          :class="{
            'grid-cols-1': weatherRow.showNumForecastDays === 1,
            'grid-cols-2': weatherRow.showNumForecastDays === 2,
            'grid-cols-3': weatherRow.showNumForecastDays === 3,
            'grid-cols-4': weatherRow.showNumForecastDays === 4,
            'grid-cols-5': weatherRow.showNumForecastDays === 5,
            'grid-cols-6': weatherRow.showNumForecastDays === 6,
            'grid-cols-7': weatherRow.showNumForecastDays === 7,
            'grid-cols-8': weatherRow.showNumForecastDays === 8,
          }"
        >
          <div v-for="(day, i) in forecastDays[rowI]" :key="i" class="flex flex-col items-center justify-between space-y-2">
            <span class="uppercase text-xs font-bold opacity-50">{{ datetimeUtils.format(day.dt * 1000, "ddd") }}</span>
            <component :is="weatherIconMap[day.weather[0].icon]" class="h-auto w-full max-h-6" />
            <div class="flex flex-col items-center justify-center">
              <span class="font-bold">{{ day.temp.max }}</span>
              <span class="opacity-50">{{ day.temp.min }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
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
          <PlaceInput :place="weatherRow.place" @change="(place) => handlePlaceChange(weatherRow, place)" />
        </label>
        <label>
          <span>Units</span>
          <select v-model="weatherRow.units" @change="handleUnitsChange">
            <option v-for="unit in supportedUnits" :key="unit" :value="unit">
              {{ unit }} (&deg;{{ unitsSymbolMap[unit] }})
            </option>
          </select>
        </label>
        <button @click="handleRemoveWeatherItem($event, weatherRow, index)">Remove</button>
      </div>
      <button @click="handleAddWeatherItem">Add</button>
    </div>
  </teleport>
</template>

<style scoped>
</style>
