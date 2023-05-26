<script setup lang="ts">
import SpaceLayout from '@/components/SpaceLayout.vue'
import { useSpaceStore } from '@/stores/space';
import { computed } from 'vue';

const props = defineProps({
  spaceUid: {
    type: String,
    required: false
  }
});

const spaceStore = useSpaceStore()

const currentSpace = computed(() => {
  return props.spaceUid ? props.spaceUid : spaceStore.defaultSpace
})

</script>

<template>
  <SpaceLayout v-if="currentSpace" :key="currentSpace" :spaceId="currentSpace" />
</template>

<style scoped>

</style>
