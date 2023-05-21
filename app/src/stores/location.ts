import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import axios from 'axios';
import type { ILocation } from '@/types/location';

export const useLocationStore = defineStore('location', () => {
  const currentLocation: Ref<ILocation | null> = ref(null)

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
        key: import.meta.env.VITE_GOOGLE_GEOCODING_API_KEY,
        latlng: `${geolocateRes.data.location.lat},${geolocateRes.data.location.lng}`,
      }
    });

    const locationCity = geocodeRes.data.results[0].address_components.find((component: any) => component.types.includes('locality'));

    const locationName = locationCity ? locationCity.long_name : geocodeRes.data.results[0].formatted_address;

    currentLocation.value = {
      name: locationName,
      formatted_address: geocodeRes.data.results[0].formatted_address,
      lat: geolocateRes.data.location.lat,
      lng: geolocateRes.data.location.lng,
    }
  }

  return {
    currentLocation,
    setCurrentLocation
  };
});
