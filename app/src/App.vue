<script setup lang="ts">
import SpaceLayout from './components/SpaceLayout.vue'
import { useFontStore } from './stores/fonts';

const fontStore = useFontStore()
</script>

<template>
  <main>
    <teleport to="body">
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link v-if="fontStore.fontsUrl" :key="fontStore.fontsUrl" :href="fontStore.fontsUrl" rel="stylesheet" type="text/css" />
    </teleport>
    <SpaceLayout />
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
