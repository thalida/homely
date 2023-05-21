<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watchEffect, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useWeatherStore } from '@/stores/weather';
import { EWeatherWidgetUnits, type IWeatherWindowWidget } from '@/types/widget'
import GooglePlaceInput from '@/components/GooglePlaceInput.vue';
import type { ILocation } from '@/types/location';
import WeatherWindow from './WeatherWindow.vue';

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
  return widgetStore.getWidgetById(props.widgetId) as IWeatherWindowWidget
})
const widgetId = ref<string | null>(null)
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

function handlePlaceChange(location: ILocation) {
  widget.value.content.items[0].location = location
}
</script>

<template>
  <div v-bind="$attrs" class="flex flex-col">
    <template v-if="isReady">
      <WeatherWindow :weatherItem="widget.content.items[0]" :widgetId="widgetId" />
    </template>
    <template v-else>
      Loading...
    </template>
  </div>
  <teleport to="#space__widget-menu">
    <div v-show="widget.state.selected" class="flex flex-col">
      <label>
        <span>Use Current Location</span>
        <input type="checkbox" v-model="widget.content.items[0].useCurrentLocation" />
      </label>
      <label v-if="!widget.content.items[0].useCurrentLocation">
        <span>Location</span>
        <GooglePlaceInput :place="widget.content.items[0].location"
          @change="(location) => handlePlaceChange(location)" />
      </label>
      <label>
        <span>Units</span>
        <select v-model="widget.content.items[0].units">
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
