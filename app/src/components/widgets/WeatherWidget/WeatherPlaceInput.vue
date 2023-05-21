<script setup lang="ts">
import type { IWeatherPlace } from '@/types/widget';
import { Loader } from '@googlemaps/js-api-loader';
import { ref, onMounted, type PropType, watchEffect } from 'vue';

const props = defineProps({
  place: {
    type: Object as PropType<IWeatherPlace | null>,
    required: false,
    default: null
  }
})
const emits = defineEmits<{
  (e: 'change', place: google.maps.places.PlaceResult): void
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
        fields: ["geometry", "name"],
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

        emits('change', place)
      });
    })
    .catch(e => {
      // do something
    });
});


</script>

<template>
  <input ref="autocompleteInput" type="text" :value="place?.name" />
</template>

<style scoped>

</style>
