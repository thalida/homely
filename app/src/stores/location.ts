import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import type { ILocation } from '@/types/location';
import { geolocate, geocode } from '@/api/location';

export const useLocationStore = defineStore('location', () => {
  const currentLocation: Ref<ILocation | null> = ref(null)

  async function setCurrentLocation() {
    if (currentLocation.value !== null) {
      return;
    }

    const currentLatLngRes = await geolocate();
    const currentLocationRes = await geocode(currentLatLngRes.lat, currentLatLngRes.lng);

    const locationCity = currentLocationRes[0].address_components.find((component: any) => component.types.includes('locality'));
    const locationName = locationCity ? locationCity.long_name : currentLocationRes[0].formatted_address;

    currentLocation.value = {
      name: locationName,
      formatted_address: currentLocationRes[0].formatted_address,
      lat: currentLatLngRes.lat,
      lng: currentLatLngRes.lng,
    }
  }

  return {
    currentLocation,
    setCurrentLocation
  };
});
