<script setup lang="ts">
import SpaceLayout from '@/components/SpaceLayout.vue'
import { useUserStore } from '@/stores/user';
import { useSpaceStore } from '@/stores/space';
import { computed } from 'vue';

const props = defineProps({
  spaceUid: {
    type: String,
    required: false
  }
});

const userStore = useUserStore()
const spaceStore = useSpaceStore()

const currentSpace = computed(() => {
  if (!userStore.isAuthenticated) {
    return spaceStore.homepageSpaces[0].uid
  }

  if (props.spaceUid && spaceStore.collection[props.spaceUid]) {
    return props.spaceUid
  }

  return spaceStore.defaultSpace
})

</script>

<template>
  <SpaceLayout v-if="currentSpace" :key="currentSpace" :spaceId="currentSpace" />
</template>

<style scoped>

</style>
