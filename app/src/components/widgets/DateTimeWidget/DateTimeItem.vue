<script setup lang="ts">
import { useDateTimeStore } from '@/stores/datetime';
import type { IDateTime } from '@/types/widget';
import { computed, ref, watchEffect, type PropType, type Ref } from 'vue';
import { SunIcon, MoonIcon, SunriseIcon, SunsetIcon } from 'lucide-vue-next';
import { isLightColor } from '@/utils/color';
import { useLocationStore } from '@/stores/location';
import { useWeatherStore } from '@/stores/weather';
import { getDayJs, getRealisticColorGradient } from '@/utils/datetime';
import type { IColor } from '@/types/color';

const dateTimeStore = useDateTimeStore();
const locationStore = useLocationStore();
const weatherStore = useWeatherStore();

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  },
  datetime: {
    type: Object as PropType<IDateTime>,
    required: true,
    default: null
  },
})


const location = computed(() => {
  return props.datetime.useCurrentLocation ? locationStore.currentLocation : props.datetime.location
})

const showOnlyDatetimes = computed(() => {
  return !props.datetime.showDynamicIcon && !props.datetime.showLocation
})

const formattedDateTimes = computed(() => {
  return dateTimeStore.formatByDateTime(props.datetime)
})

const dynamicIcon = computed(() => {
  if (!props.datetime.showDynamicIcon) {
    return null
  }

  const timeOfDay = dateTimeStore.getTimeOfDay(props.datetime)

  if (timeOfDay === 'day') {
    return SunIcon
  }

  if (timeOfDay === 'night') {
    return MoonIcon
  }

  if (timeOfDay === 'sunrise') {
    return SunriseIcon
  }

  if (timeOfDay === 'sunset') {
    return SunsetIcon
  }

  return null
})



const colorGradient: Ref<{start: IColor, end: IColor} | null> = ref(null)
const colorGradientCss: Ref<string> = ref("")
const contrastTextColor: Ref<string> = ref("")

watchEffect(async () => {
  if (!props.datetime.showDynamicBackground) {
    colorGradient.value = null
    colorGradientCss.value = ""
    contrastTextColor.value = ""

    return
  }

  colorGradient.value = dateTimeStore.getColorGradient(props.datetime)

  if (colorGradient.value === null) {
    return
  }

  const startCss = `rgb(${colorGradient.value.start.r}, ${colorGradient.value.start.g}, ${colorGradient.value.start.b})`
  const endCss = `rgb(${colorGradient.value.end.r}, ${colorGradient.value.end.g}, ${colorGradient.value.end.b})`
  colorGradientCss.value = `linear-gradient(225deg, ${startCss}, ${endCss})`
  contrastTextColor.value = isLightColor(colorGradient.value.end) ? 'black' : 'white'
})

</script>

<template>
<div
  class="widget-theme-bg widget-theme-text flex flex-row items-center justify-between px-4 py-2 grow"
  :style="{
    'background-image': colorGradientCss,
    'color': contrastTextColor,
  }"
>
  <div v-if="datetime.showDynamicIcon || datetime.showLocation" class="flex flex-row items-center space-x-4 min-w-0">
    <div v-if="datetime.showDynamicIcon && dynamicIcon">
      <component :is="dynamicIcon" />
    </div>
    <span class="text-lg truncate" v-if="datetime.showLocation">
      {{ location?.name }}
    </span>
  </div>
  <div
    v-if="datetime.showLine1 || datetime.showLine2"
    class="flex flex-col justify-center grow"
    :class="{
      'scale-text items-center text-center': showOnlyDatetimes,
      'items-end text-right': !showOnlyDatetimes,
    }"
  >
    <div
      v-if="datetime.showLine1"
      class="truncate"
      :class="{
        'font-bold': showOnlyDatetimes,
        'text-lg': !showOnlyDatetimes,
      }"
    >
      {{ formattedDateTimes.line1 }}
    </div>
    <div
      v-if="datetime.showLine2"
      class="truncate"
      :class="{
        'font-bold': showOnlyDatetimes,
        'text-sm': !showOnlyDatetimes,
      }">
      {{ formattedDateTimes.line2 }}
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
