import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import type { ILocation, ILocations } from '@/types/location';
import { geolocate, geocode } from '@/api/location';

export const useLocationStore = defineStore('location', () => {
  const locations = ref<ILocations>({})
  const currentLocation: Ref<ILocation | null> = ref(null)

  function addLocation(location: ILocation) {
    locations.value[location.name] = location
  }

  async function setCurrentLocation() {
    if (currentLocation.value !== null) {
      return;
    }

    const currentLatLngRes = await geolocate();
    const currentLocationRes = await geocode(currentLatLngRes.lat, currentLatLngRes.lng);

    const neighborhood = currentLocationRes[0].address_components.find((component: any) => component.types.includes('neighborhood'));
    const subLocal = currentLocationRes[0].address_components.find((component: any) => component.types.includes('sublocality_level_1'));
    const city = currentLocationRes[0].address_components.find((component: any) => component.types.includes('locality'));

    const address = currentLocationRes[0].formatted_address
    let locationName = '';
    if (neighborhood) {
      locationName = neighborhood.long_name;
    } else if (subLocal) {
      locationName = subLocal.long_name;
    } else if (city) {
      locationName = city.long_name;
    } else {
      locationName = address;
    }

    currentLocation.value = {
      name: locationName,
      formatted_address: address,
      lat: currentLatLngRes.lat,
      lng: currentLatLngRes.lng,
    }

    addLocation(currentLocation.value)
  }

  return {
    locations,
    currentLocation,
    setCurrentLocation,
    addLocation,
  };
});
