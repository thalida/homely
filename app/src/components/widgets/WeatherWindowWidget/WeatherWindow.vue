<script setup lang="ts">
import { computed, type PropType, watch, ref } from 'vue';
import type { IWeatherWindowWidgetItem } from '@/types/widget'
import { useWeatherStore } from '@/stores/weather';
import { useLocationStore } from '@/stores/location';
import { useDateTimeStore } from '@/stores/datetime';
import * as lottieFiles from './weatherLottie'

console.log(lottieFiles)

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

const dateTimeStore = useDateTimeStore()
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

  return dateTimeStore.getColorGradient(weatherData.value.timezone, true)
})

const colorGradientCss = computed(() => {
  if (colorGradient.value === null) {
    return ""
  }

  const startCss = `rgb(${colorGradient.value.start.r}, ${colorGradient.value.start.g}, ${colorGradient.value.start.b})`
  const endCss = `rgb(${colorGradient.value.end.r}, ${colorGradient.value.end.g}, ${colorGradient.value.end.b})`
  return `linear-gradient(180deg, ${startCss}, ${endCss})`
})

const weatherLottieMap = ref({
  "01d": lottieFiles.sunLottie,
  "01n": lottieFiles.moonLottie,
  "02d": lottieFiles.cloudSunLottie,
  "02n": lottieFiles.cloudMoonLottie,
  "03d": lottieFiles.cloudLottie,
  "03n": lottieFiles.cloudLottie,
  "04d": lottieFiles.cloudLottie,
  "04n": lottieFiles.cloudLottie,
  "09d": lottieFiles.cloudSunRainLottie,
  "09n": lottieFiles.cloudMoonRainLottie,
  "10d": lottieFiles.cloudSunHeavyrainLottie,
  "10n": lottieFiles.cloudMoonHeavyrainLottie,
  "11d": lottieFiles.cloudThunderHeavyrainLottie,
  "11n": lottieFiles.cloudThunderHeavyrainLottie,
  "13d": lottieFiles.cloudSunSnowLottie,
  "13n": lottieFiles.cloudMoonSnowLottie,
  "50d": null,
  "50n": null,
} as Record<string, any>)

const currentLottie = computed(() => {
  if (!weatherData.value) {
    return null
  }

  return weatherLottieMap.value[weatherData.value.currently.weather[0].icon]
})


watch(() => props.weatherItem, () => {
  weatherStore.updateWeatherByWigetItem(props.weatherItem)
}, { deep: true })
</script>

<template>
  <div class="weather-window">
    <div
      class="weather-window__sky"
      :style="{
        backgroundImage: colorGradientCss
      }"
    ></div>
    <div class="weather-window__sky">
      <Vue3Lottie v-if="currentLottie" :animationData="currentLottie" />
    </div>
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

  &__sky {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

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
