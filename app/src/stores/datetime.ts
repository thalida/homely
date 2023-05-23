import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import * as datetimeUtils from '@/utils/datetime';
import { useWeatherStore } from './weather';
import { useLocationStore } from './location';
import type { ILocation } from '@/types/location';
import type { IDateTime } from '@/types/widget';

export const useDateTimeStore = defineStore('datetime', () => {
  const locationStore = useLocationStore()
  const weatherStore = useWeatherStore()
  const now = ref(new Date())
  const interval: Ref<number | null> = ref(null)
  const connectedWidgets: Ref<string[]> = ref([])
  const timezoneByLocation: Ref<Record<string, string>> = ref({})

  async function connect(widgetId: string) {
    await locationStore.setCurrentLocation()
    if (locationStore.currentLocation) {
      await getTimezone(locationStore.currentLocation)
    }
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

  function formatByDateTime(dateTime: IDateTime) {
    const timezone = dateTime.useCurrentLocation ? null : dateTime.timezone
    return {
      line1: format(dateTime.formatLine1, timezone),
      line2: format(dateTime.formatLine2, timezone),
    }
  }

  function format(formatString: string, timezone: string | null = null) {
    return datetimeUtils.format(now.value, formatString, timezone)
  }

  function getTimeOfDay(dateTime: IDateTime) {
    const timezone = dateTime.useCurrentLocation ? null : dateTime.timezone
    return datetimeUtils.timeOfDay(now.value, timezone)
  }

  function getColorGradient(dateTime: IDateTime) {
    const timezone = dateTime.useCurrentLocation ? null : dateTime.timezone
    return datetimeUtils.getColorGradient(timezone)
  }

  async function getTimezone(location: ILocation) {
    if (!location) {
      return null;
    }

    if (timezoneByLocation.value[location.formatted_address]) {
      return timezoneByLocation.value[location.formatted_address]
    }

    const weatherData = await weatherStore.fetchWeather(location)

    if (!weatherData) {
      return null;
    }

    timezoneByLocation.value[location.formatted_address] = weatherData.timezone

    return timezoneByLocation.value[location.formatted_address]
  }

  return {
    now,
    connect,
    disconnect,
    getTimezone,
    formatByDateTime,
    format,
    getTimeOfDay,
    getColorGradient,
  };
});
