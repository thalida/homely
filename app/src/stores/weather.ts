import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import axios from 'axios';
import { useWidgetStore } from '@/stores/widget';
import { useLocationStore } from './location';
import {
  EWeatherWidgetUnits,
  type IWeatherByLocation,
  type IWeatherWidget,
  type IWeatherWidgetItem,
  type IWeatherWindowWidget,
  type IWeatherWindowWidgetItem,
} from '@/types/widget';
import type { ILocation } from '@/types/location';

export const useWeatherStore = defineStore('weather', () => {
  const locationStore = useLocationStore()
  const widgetStore = useWidgetStore()
  const interval: Ref<number | null> = ref(null)
  const connectedWidgets: Ref<string[]> = ref([])
  const weatherByLocation = ref<IWeatherByLocation>({})
  const ONE_HOUR = 60 * 60 * 1000


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

    interval.value = window.setInterval(updateAllWeatherWidgets, ONE_HOUR)
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
    const widget = widgetStore.getWidgetById(widgetId) as IWeatherWidget | IWeatherWindowWidget;
    if (!widget) {
      return weatherByLocation.value;
    }

    for (let i = 0; i < widget.content.items.length; i += 1) {
      const weatherItem = widget.content.items[i]
      updateWeatherByWigetItem(weatherItem)
    }

    return weatherByLocation.value
  }

  async function updateWeatherByWigetItem(weatherItem: IWeatherWidgetItem | IWeatherWindowWidgetItem) {
    const location = (weatherItem.useCurrentLocation) ? locationStore.currentLocation : weatherItem.location;

    if (!location) {
      return
    }

    const units = weatherItem.units || EWeatherWidgetUnits.METRIC;
    await fetchWeather(location, units)
  }

  function shouldFetch(location: ILocation, units: EWeatherWidgetUnits) {
    const existingWeather = weatherByLocation.value[location.formatted_address];
    const lastFetchedOn = existingWeather?.fetchedOn || null;

    if (lastFetchedOn === null) {
      return true;
    }

    if (existingWeather.fetchedWith.units !== units) {
      return true;
    }

    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchedOn;
    if (timeSinceLastFetch >= ONE_HOUR) {
      return true;
    }

    return false;
  }

  async function fetchWeather(location: ILocation , units = EWeatherWidgetUnits.METRIC) {
    if (!shouldFetch(location, units)) {
      return weatherByLocation.value[location.formatted_address];
    }


    const apiUrl = "https://api.openweathermap.org/data/3.0/onecall";
    const res = await axios.get(apiUrl, {
      params: {
        lat: location.lat,
        lon: location.lng,
        appid: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
        units,
        exclude: 'minutely,hourly,alerts',
      }
    });

    weatherByLocation.value[location.formatted_address] = {
      currently: res.data.current,
      forecast: res.data.daily,
      fetchedOn: Date.now(),
      fetchedWith: {
        units,
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
  };
});
