<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watchEffect, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useWeatherStore } from '@/stores/weather';
import type { IWeatherWidget } from '@/types/widget'

import { Loader } from '@googlemaps/js-api-loader';

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

const widgetStore = useWidgetStore()
const weatherStore = useWeatherStore()
const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId) as IWeatherWidget
})
const widgetId = ref<string | null>(null)
const autocompleteInput = ref<HTMLInputElement>()
const location = ref<string>('')

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
</script>

<template>
  <div>
    {{ widget.content.location }}
    {{ widget.content.weather }}
    <!-- <div v-for="(datetime, index) in widget.content.datetimes" :key="index">
      {{ weatherStore.format(datetime) }}
    </div> -->
  </div>
  <teleport to="#space__widget-menu">
    <div v-show="widget.state.selected">
      <label>
        <span>Use Current Location</span>
        <input type="checkbox" v-model="widget.content.useCurrentLocation" />
      </label>
      <input ref="autocompleteInput" type="text" v-model="location" :disabled="widget.content.useCurrentLocation" />
      <!-- <div v-for="(datetime, index) in widget.content.datetimes" :key="index">
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
            <option v-for="timezone in weatherStore.supportedTimezones" :key="timezone" :value="timezone">{{ timezone }}
            </option>
          </select>
        </label>
        <button @click="handleRemoveDateTime($event, datetime, index)">Remove</button>
      </div>
      <div>
        <button @click="handleAddDateTime">Add</button>
      </div> -->
    </div>
  </teleport>
</template>

<style scoped>
</style>
