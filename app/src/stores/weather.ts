import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useWidgetStore } from '@/stores/widget';
import { useLocationStore } from '@/stores/location';
import type { ILocation } from '@/types/location';
import type { IWeatherByLocation, IWeatherWidgetItem, TWeatherWidget } from '@/widgets/WeatherWidget/types';
import { getWeather } from '@/api/weather';

export const useWeatherStore = defineStore('weather', () => {
  const locationStore = useLocationStore()
  const widgetStore = useWidgetStore()
  const interval: Ref<number | null> = ref(null)
  const connectedWidgets: Ref<string[]> = ref([])
  const weatherByLocation: Ref<IWeatherByLocation> = useLocalStorage('homely/weather/weatherByLocation', {})
  // const weatherByLocation: Ref<IWeatherByLocation> = ref({})
  // const ONE_HOUR = 60 * 60 * 1000
  const THIRTY_MINUTES = 30 * 60 * 1000
  const UPDATE_FREQUENCY = THIRTY_MINUTES


  async function connect(widgetId: string) {
    await locationStore.setCurrentLocation()
    await updateWeatherByWidget(widgetId)
    connectedWidgets.value.push(widgetId)
    startInterval()
  }

  function disconnect(widgetId: string) {
    const index = connectedWidgets.value.indexOf(widgetId)
    if (index === -1) {
      return;
    }

    connectedWidgets.value.splice(index, 1)

    if (connectedWidgets.value.length === 0) {
      stopInterval()
    }
  }


  function startInterval() {
    if (interval.value) {
      return;
    }

    interval.value = window.setInterval(updateAllWeatherWidgets, UPDATE_FREQUENCY)
  }

  function stopInterval() {
    if (!interval.value) {
      return;
    }

    window.clearInterval(interval.value)
    interval.value = null
  }

  async function updateAllWeatherWidgets() {
    for (const widgetId of connectedWidgets.value) {
      updateWeatherByWidget(widgetId)
    }
  }

  async function updateWeatherByWidget(widgetId: string) {
    const widget = widgetStore.getWidgetById(widgetId) as TWeatherWidget;
    if (!widget) {
      return weatherByLocation.value;
    }

    for (let i = 0; i < widget.content.items.length; i += 1) {
      const weatherItem = widget.content.items[i]
      updateWeatherByWigetItem(weatherItem)
    }

    return weatherByLocation.value
  }

  async function updateWeatherByWigetItem(weatherItem: IWeatherWidgetItem) {
    const location = (weatherItem.useCurrentLocation) ? locationStore.currentLocation : weatherItem.location;

    if (!location) {
      return
    }

    await fetchWeather(location)
  }

  function shouldFetch(location: ILocation) {
    const existingWeather = weatherByLocation.value[location.formatted_address];
    const lastFetchedOn = existingWeather?.fetchedOn || null;

    if (lastFetchedOn === null) {
      return true;
    }

    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchedOn;
    if (timeSinceLastFetch >= UPDATE_FREQUENCY) {
      return true;
    }

    return false;
  }

  async function fetchWeather(location: ILocation ) {
    if (!shouldFetch(location)) {
      return weatherByLocation.value[location.formatted_address];
    }

    const res = await getWeather({ lat: location.lat, lng: location.lng });

    weatherByLocation.value[location.formatted_address] = {
      timezone: res.timezone,
      currently: res.current,
      forecast: res.daily,
      fetchedOn: Date.now(),
      fetchedWith: {
        location,
      }
    }

    return weatherByLocation.value[location.formatted_address];
  }

  return {
    connect,
    disconnect,
    weatherByLocation,
    updateWeatherByWidget,
    updateWeatherByWigetItem,
    fetchWeather,
  };
});
