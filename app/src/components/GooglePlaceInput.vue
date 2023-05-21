<script setup lang="ts">
import type { ILocation } from '@/types/location';
import { Loader } from '@googlemaps/js-api-loader';
import { ref, onMounted, type PropType } from 'vue';

defineProps({
  place: {
    type: Object as PropType<ILocation | null>,
    required: false,
    default: null
  }
})
const emits = defineEmits<{
  (e: 'change', location: ILocation, place: google.maps.places.PlaceResult): void
}>()
const autocompleteInput = ref<HTMLInputElement>()

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  version: "weekly",
  libraries: ["places"],
});

onMounted(() => {
  if (!autocompleteInput.value) {
    return
  }

  loader
    .load()
    .then((google) => {
      if (autocompleteInput.value === null) {
        return
      }

      const autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value as HTMLInputElement, {
        types: ['(cities)'],
        fields: ["geometry", "name", "formatted_address"],
        strictBounds: false,
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        const location: ILocation = {
          name: place.name || "Unknown",
          formatted_address: place.formatted_address || "Unknown",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        emits('change', location, place)
      });
    })
});


</script>

<template>
  <input ref="autocompleteInput" type="text" :value="place?.formatted_address" />
</template>

<style scoped>

</style>
