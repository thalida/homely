<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { IWeatherWidgetItem } from '@/types/widget'
import { useWeatherStore } from '@/stores/weather';
import { useLocationStore } from '@/stores/location';
import { unitsSymbolMap, weatherLottieMap } from './index'
import { getColorGradient } from '@/utils/datetime';

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  },
  weatherItem: {
    type: Object as PropType<IWeatherWidgetItem>,
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

const colorGradient = computed(() => {
  if (!weatherData.value) {
    return null
  }

  return getColorGradient(weatherData.value.timezone, true)
})

const colorGradientCss = computed(() => {
  if (colorGradient.value === null) {
    return ""
  }

  const startCss = `rgb(${colorGradient.value.start.r}, ${colorGradient.value.start.g}, ${colorGradient.value.start.b})`
  const endCss = `rgb(${colorGradient.value.end.r}, ${colorGradient.value.end.g}, ${colorGradient.value.end.b})`
  return `linear-gradient(180deg, ${startCss}, ${endCss})`
})

const currentLottie = computed(() => {
  if (!weatherData.value) {
    return null
  }

  return weatherLottieMap[weatherData.value.currently.weather[0].icon]
})
</script>

<template>
  <div v-if="weatherData && weatherData.currently" class="flex flex-col items-center justify-center">
    <div class="weather-window">
      <div
        class="sky"
        :style="{
          backgroundImage: colorGradientCss
        }"
      >
        <Vue3Lottie :key="currentLottie" v-if="currentLottie" :animationData="currentLottie" />
      </div>

      <div class="glass-pane"></div>

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

    <div>
      <div v-if="weatherItem.showLocation">{{ weatherLocation?.name }}</div>
      <div>
        <span v-if="weatherItem.showTemperature">
          {{ Math.round(weatherData.currently.temp) }}&deg;
          <span v-if="weatherItem.showUnits">
            {{ unitsSymbolMap[weatherItem.units] }}
          </span>
        </span>
        <span v-if="weatherItem.showDescription" class="capitalize">
          {{ weatherData.currently.weather[0].description }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-window {
  --weather-window-seam-width: 0.5cqmin;
  --weather-window-border: #000;

  width: 100%;
  height: 100%;
  border-radius: 50% 50%  16px 16px;
  overflow: hidden;
  position: relative;
  border: var(--weather-window-seam-width) solid var(--weather-window-border);

  .sky {
    z-index: 1;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .glass-pane {
    z-index: 2;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    filter: blur(100cqb);
    background-image: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 100%);
  }

  .seams-wrapper {
    z-index: 3;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
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

    .seam:first-child {
      margin-top: 10%;
    }
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
