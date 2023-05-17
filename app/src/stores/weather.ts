import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import axios from 'axios';
import { useWidgetStore } from './widget';
import { EWeatherWidgetUnits, type IWeatherLocation, type IWeatherWidget } from '@/types/widget';

export const useWeatherStore = defineStore('weather', () => {
  const widgetStore = useWidgetStore()
  const interval: Ref<number | null> = ref(null)
  const connectedWidgets: Ref<string[]> = ref([])
  const currentLocation: Ref<IWeatherLocation | null> = ref(null)


  async function connect(widgetId: string, timezone: string | null = null) {
    await setCurrentLocation()
    await updateWeather(widgetId)
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

    const hourly = 60 * 60 * 1000
    interval.value = window.setInterval(updateAllWeather, hourly)
  }

  function stopInterval() {
    if (!interval.value) {
      return;
    }

    window.clearInterval(interval.value)
    interval.value = null
  }

  async function setCurrentLocation() {
    if (currentLocation.value !== null) {
      return;
    }

    const geolocateApiUrl = "https://www.googleapis.com/geolocation/v1/geolocate";
    const geolocateRes = await axios.post(geolocateApiUrl, {}, {
      params: {
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      }
    });

    const geocodeApiUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    const geocodeRes = await axios.get(geocodeApiUrl, {
      params: {
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        latlng: `${geolocateRes.data.location.lat},${geolocateRes.data.location.lng}`,
        result_type: 'locality',
      }
    });

    const locationCity = geocodeRes.data.results[0].address_components.find((component) => component.types.includes('locality'));

    const locationName = locationCity ? locationCity.long_name : geocodeRes.data.results[0].formatted_address;

    currentLocation.value = {
      name: locationName,
      lat: geolocateRes.data.location.lat,
      lng: geolocateRes.data.location.lng,
    }
  }

  async function updateAllWeather() {
    for (const widgetId of connectedWidgets.value) {
      updateWeather(widgetId)
    }
  }

  async function updateWeather(widgetId: string) {
    const widget = widgetStore.getWidgetById(widgetId) as IWeatherWidget;
    if (!widget) {
      return;
    }

    const location = (widget.content.useCurrentLocation) ? currentLocation.value : widget.content.location;

    if (!location) {
      return;
    }

    const apiUrl = "https://api.openweathermap.org/data/3.0/onecall";
    const units = widget.content.units || EWeatherWidgetUnits.METRIC;
    const res = await axios.get(apiUrl, {
      params: {
        lat: location.lat,
        lon: location.lng,
        appid: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
        units,
        exclude: 'minutely,hourly,daily,alerts',
      }
    });

    widget.content.location = location
    widget.content.weatherForcecast = res.data.current
  }

  return {
    connect,
    disconnect,
    updateWeather,
  };
});
