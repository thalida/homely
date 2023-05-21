<script setup lang="ts">
import { useDateTimeStore } from '@/stores/datetime';
import type { IDateTime } from '@/types/widget';
import { computed, type PropType } from 'vue';
import { SunIcon, MoonIcon } from 'lucide-vue-next';
import { isLightColor } from '@/utils/color';

const dateTimeStore = useDateTimeStore();
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

const showOnlyDatetimes = computed(() => {
  return !props.datetime.showDayNightIcon && !props.datetime.showCity
})

const isNight = computed(() => {
  return dateTimeStore.isNight(props.datetime)
})

const colorGradient = computed(() => {
  return dateTimeStore.getColorGradient(props.datetime)
})

const colorGradientCss = computed(() => {
  if(!props.datetime.showDayNightBackground) {
    return ""
  }

  const startCss = `rgb(${colorGradient.value.start.r}, ${colorGradient.value.start.g}, ${colorGradient.value.start.b})`
  const endCss = `rgb(${colorGradient.value.end.r}, ${colorGradient.value.end.g}, ${colorGradient.value.end.b})`
  return `linear-gradient(135deg, ${startCss}, ${endCss})`
})

const contrastTextColor = computed(() => {
  return isLightColor(colorGradient.value.end) ? 'black' : 'white'
})

const timezoneDisplay = computed(() => {
  const timezone = props.datetime.useLocalTime ? dateTimeStore.localTimezone : props.datetime.timezone
  if (!timezone) {
    return
  }

  const timezoneParts = timezone.split('/')
  if (timezoneParts.length === 1) {
    return timezone
  }

  const [, ...cityParts] = timezoneParts
  const cityStr = cityParts.join(' - ').replaceAll('_', ' ')

  return cityStr
})

const datetimeLine1 = computed(() => {
  return dateTimeStore.format(props.datetime, props.datetime.formatLine1)
})

const datetimeLine2 = computed(() => {
  return dateTimeStore.format(props.datetime, props.datetime.formatLine2)
})

</script>

<template>
<div
  class="flex flex-row items-center justify-between px-4 py-2 grow"
  :style="{
    'background-image': colorGradientCss,
    'color': contrastTextColor,
  }"
  :class="{
    // 'bg-blue-950 text-white': datetime.showDayNightBackground && isNight,
    // 'bg-yellow-300': datetime.showDayNightBackground && !isNight,
  }">
  <div v-if="datetime.showDayNightIcon || datetime.showCity" class="flex flex-row items-center space-x-4 grow">
    <div v-if="datetime.showDayNightIcon">
      <MoonIcon v-if="dateTimeStore.isNight(datetime)" />
      <SunIcon v-else />
    </div>
    <div class="flex flex-col" v-if="datetime.showCity">
      <span class="text-lg">{{ timezoneDisplay }}</span>
      <span v-if="datetime.useLocalTime && datetime.showIsLocalTimeLabel" class="text-xs">Current Location</span>
    </div>
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
      :class="{
        'font-bold': showOnlyDatetimes,
        'text-lg': !showOnlyDatetimes,
      }"
    >
      {{ datetimeLine1 }}
    </div>
    <div
      v-if="datetime.showLine2"
      :class="{
        'font-bold': showOnlyDatetimes,
        'text-sm': !showOnlyDatetimes,
      }">
      {{ datetimeLine2 }}
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
