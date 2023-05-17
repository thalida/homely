<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watchEffect, ref } from 'vue'
import { Loader } from '@googlemaps/js-api-loader';
import { useWidgetStore } from '@/stores/widget'
import { useWeatherStore } from '@/stores/weather';
import { EWeatherWidgetUnits, type IWeatherWidget } from '@/types/widget'
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


const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  version: "weekly",
  libraries: ["places"],
});

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
const autocompleteInput = ref<HTMLInputElement>()
const location = ref<string>('')

const isSelected = computed(() => {
  return widget.value.state.selected;
})
const currentWeather = computed(() => {
  return widget.value?.content.weatherForcecast?.weather[0]
})
const supportedUnits = computed(() => {
  return Object.values(EWeatherWidgetUnits)
})
const unitsSymbolMap = ref({
  [EWeatherWidgetUnits.STANDARD]: 'K',
  [EWeatherWidgetUnits.METRIC]: 'C',
  [EWeatherWidgetUnits.IMPERIAL]: 'F',
} as Record<string, string>)

watchEffect(() => {
  if (widget.value) {
    widgetId.value = widget.value.id
  }
})

onMounted(async () => {
  if (!widget.value) {
    return
  }

  await weatherStore.connect(widget.value.id)

  location.value = widget.value.content.location.name
  console.log(widget.value.content.location)
  console.log(widget.value.content.weatherForcecast)

  loader
    .load()
    .then((google) => {
      if (autocompleteInput.value === null) {
        return
      }

      const autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value as HTMLInputElement, {
        types: ['(cities)'],
        fields: ["geometry", "name"],
        strictBounds: false,
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        widget.value.content.location = {
          name: place.name || "Unknown",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        weatherStore.updateWeather(widget.value.id)
      });
    })
    .catch(e => {
      // do something
    });
})

onBeforeUnmount(() => {
  if (!widgetId.value) {
    return
  }

  weatherStore.disconnect(widgetId.value)
})

function handleUnitsChange() {
  weatherStore.updateWeather(widget.value.id)
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex w-full h-full cursor-pointer overflow-auto bg-slate-100"
    :class="{
      'ring-2 ring-pink-500': isSelected,
      'flex-col justify-center items-center py-4 px-8 space-y-4': currentWeather,
    }">
    <template v-if="currentWeather">
      <div class="flex flex-row justify-between items-center w-full text-sm">
        <span class="capitalize">
          {{ currentWeather.description }}
        </span>
        <span>{{ widget.content.location?.name }}</span>
      </div>
      <div class="flex flex-row justify-between items-center w-full">
        <div class="flex flex-row text-2xl font-bold">
          {{ widget.content.weatherForcecast.temp }}&deg;
        </div>
        <component :is="weatherIconMap[currentWeather.icon]" class="h-full w-auto max-h-16" />
      </div>
    </template>
  </div>
  <teleport to="#space__widget-menu">
    <div v-show="widget.state.selected">
      <label>
        <span>Use Current Location</span>
        <input type="checkbox" v-model="widget.content.useCurrentLocation" />
      </label>
      <input ref="autocompleteInput" type="text" v-model="location" :disabled="widget.content.useCurrentLocation" />
      <label>
        <span>Units</span>
        <select v-model="widget.content.units" @change="handleUnitsChange">
          <option v-for="unit in supportedUnits" :key="unit" :value="unit">
            {{ unit }} (&deg;{{ unitsSymbolMap[unit] }})
          </option>
        </select>
      </label>
    </div>
  </teleport>
</template>

<style scoped>
</style>
