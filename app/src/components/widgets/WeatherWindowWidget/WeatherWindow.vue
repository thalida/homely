<script setup lang="ts">
import { computed, type PropType, watch, ref } from 'vue';
import type { IWeatherWindowWidgetItem } from '@/types/widget'
import { useWeatherStore } from '@/stores/weather';
import { useLocationStore } from '@/stores/location';

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  },
  weatherItem: {
    type: Object as PropType<IWeatherWindowWidgetItem>,
    required: true,
    default: null
  },
})

const weatherStore = useWeatherStore()
const locationStore = useLocationStore()

const weatherLocation = computed(() => {
  return props.weatherItem.useCurrentLocation ? locationStore.currentLocation : props.weatherItem.location
})

const weatherData = computed(() => {
  if (!weatherLocation.value) {
    return null
  }
  return weatherStore.weatherByLocation[weatherLocation.value.formatted_address]
})

watch(() => props.weatherItem, () => {
  weatherStore.updateWeatherByWigetItem(props.weatherItem)
}, { deep: true })
</script>

<template>
  <div class="weather-window">
    <div class="seams-wrapper">
      <div class="seams seams--horizontal">
        <div class="seam">
          <div class="seam--diagonal-left"></div>
          <div class="seam--diagonal-right"></div>
        </div>
        <div class="seam"></div>
      </div>
      <div class="seams seams--vertical">
        <div class="seam"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-window {
  --weather-window-seam-width: 5px;
  --weather-window-border: #000;

  width: 100%;
  height: 100%;
  border-radius: 50% 50%  16px 16px;
  overflow: hidden;
  position: relative;
  border: var(--weather-window-seam-width) solid var(--weather-window-border);

  .seams-wrapper {
    width: 100%;
    height: 100%;
  }

  .seams {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .seams--horizontal {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: space-evenly;
  }

  .seams--vertical {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-evenly;
  }

  .seam {
    background: var(--weather-window-border);
  }

  .seams--vertical .seam {
    width: var(--weather-window-seam-width);
    height: 100%;
  }

  .seams--horizontal .seam {
    height: var(--weather-window-seam-width);
    width: 100%;
  }

  .seam--diagonal-left {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    transform: rotate(45deg);
    transform-origin: 100% 0;
    background-color: inherit;
  }

  .seam--diagonal-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    transform: rotate(-45deg);
    transform-origin: 0 0;
    background-color: inherit;
  }
}
</style>
