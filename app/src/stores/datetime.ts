import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import type { IDateTime } from '@/types/widget';
import * as datetimeUtils from '@/utils/datetime';
import type { IColor } from '@/types/color';

export const useDateTimeStore = defineStore('datetime', () => {
  const now = ref(new Date())
  const supportedTimezones = ref(Intl.supportedValuesOf('timeZone'))
  const localTimezone = ref(datetimeUtils.guessTimezone())
  const interval: Ref<number | null> = ref(null)
  const connectedWidgets: Ref<string[]> = ref([])

  const HOURS_IN_DAY = 24;
  const MINUTES_IN_HOUR = 60;
  const TIME_COLORS = [
    { r: 4, g: 10, b: 30 },
    { r: 139, g: 152, b: 206 },
    { r: 86, g: 216, b: 255 },
    { r: 255, g: 216, b: 116 },
    { r: 255, g: 183, b: 116 },
    { r: 255, g: 153, b: 116 },
    { r: 255, g: 103, b: 116 },
    { r: 20, g: 40, b: 116 },
  ];
  const SUNSET_COLOR_IDX = 6;

  function connect(widgetId: string) {
    connectedWidgets.value.push(widgetId)
    startInterval()
  }

  function disconnect(widgetId: string) {
    const index = connectedWidgets.value.indexOf(widgetId)
    if (index === -1) {
      return;
    }

    connectedWidgets.value.splice(index, 1)

    if(connectedWidgets.value.length === 0) {
      stopInterval()
    }
  }


  function startInterval() {
    if (interval.value) {
      return;
    }

    interval.value = window.setInterval(() => {
      now.value = new Date()
    }, 1000)
  }

  function stopInterval() {
    if (!interval.value) {
      return;
    }

    window.clearInterval(interval.value)
    interval.value = null
  }

  function format(datetime: IDateTime, formatString: string) {
    return datetimeUtils.format(now.value, formatString, datetime.timezone)
  }

  function isNight(datetime: IDateTime) {
    return datetimeUtils.isNightTime(now.value, datetime.timezone)
  }

  function getColorBlend(startColor: IColor, endColor: IColor, distance: number) {
    const blendedColor: IColor = {
      r: 0,
      g: 0,
      b: 0,
    };

    const keys: (keyof IColor)[] = Object.keys(startColor) as (keyof IColor)[];
    for (const part of keys) {
      const start = startColor[part];
      const end = endColor[part];
      blendedColor[part] = Math.round(start + (end - start) * distance);
    }

    return blendedColor;
  }

  function getColorGradient(datetime: IDateTime) {
    const date = datetimeUtils.getDayJs(now.value, datetime.timezone)
    const hour = date.hour();
    const minute = date.minute();
    const numSegements = HOURS_IN_DAY / TIME_COLORS.length;
    const startColorIdx = Math.floor(hour / numSegements);
    const endColorIdx =
      startColorIdx + 1 < TIME_COLORS.length ? startColorIdx + 1 : 0;

    const timeInMins = hour * MINUTES_IN_HOUR + minute;
    const startColor = TIME_COLORS[startColorIdx];
    const endColor = TIME_COLORS[endColorIdx];
    const colorStartTimeInMins = startColorIdx * numSegements * MINUTES_IN_HOUR;
    const colorEndTimeInMins =
      endColorIdx === 0
        ? HOURS_IN_DAY * MINUTES_IN_HOUR
        : endColorIdx * numSegements * MINUTES_IN_HOUR;
    const minSinceColorStart = timeInMins - colorStartTimeInMins;
    const minsInColorRange = Math.abs(
      colorEndTimeInMins - colorStartTimeInMins
    );
    const gradientStartDistance =
      minSinceColorStart - 60 >= 0
        ? (minSinceColorStart - 60) / minsInColorRange
        : 0;
    const gradientStart = getColorBlend(
      startColor,
      endColor,
      gradientStartDistance
    );
    const gradientEndDistance = minSinceColorStart / minsInColorRange;
    const gradientEnd = getColorBlend(
      startColor,
      endColor,
      gradientEndDistance
    );

    const gradient = {
      start: gradientStart,
      end: gradientEnd,
    };

    return gradient;
  }

  return {
    now,
    localTimezone,
    supportedTimezones,
    connect,
    disconnect,
    format,
    isNight,
    getColorGradient,
  };
});
