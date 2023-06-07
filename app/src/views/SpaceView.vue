<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import SpaceHeader from '@/components/SpaceHeader.vue'
import SpaceMain from '@/components/SpaceMain.vue'
import SpaceBackground from '@/components/SpaceBackground.vue'
import { useSpaceStore } from '@/stores/space'

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
});

const spaceStore = useSpaceStore()
const isLoading = ref(true);
const fetchError = ref(false);

watchEffect(async () => {
  try {
    isLoading.value = true
    await spaceStore.getSpace(props.spaceId)
  } catch (error) {
    fetchError.value = true
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="space-view flex flex-col">
    <SpaceBackground v-if="spaceId" :key="spaceId" :spaceId="spaceId" />
    <SpaceHeader v-if="spaceId" :key="spaceId" :spaceId="spaceId" />
    <main v-if="isLoading">
      Loading &hellip;
    </main>
    <main v-else-if="fetchError">
      Error
    </main>
    <SpaceMain v-else-if="spaceId" :key="spaceId" :spaceId="spaceId" />
  </div>
</template>

<style scoped>
.space-view {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
</style>
