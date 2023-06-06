<script setup lang="ts">
import SpaceHeader from '@/components/SpaceHeader.vue'
import SpaceMain from '@/components/SpaceMain.vue'
import SpaceBackground from '@/components/SpaceBackground.vue'

defineProps({
  spaceId: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="space-view flex flex-col">
    <SpaceBackground v-if="spaceId" :key="spaceId" :spaceId="spaceId" />
    <SpaceHeader v-if="spaceId" :key="spaceId" :spaceId="spaceId" />
    <SpaceMain v-if="spaceId" :key="spaceId" :spaceId="spaceId" />
  </div>
</template>

<style scoped>
.space-view {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
</style>
