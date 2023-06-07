<script setup lang="ts">
import { RouterView } from "vue-router";
import { useFontStore } from './stores/fonts';
import { useUIStore } from './stores/ui';
import { useUserStore } from './stores/user';
import { useSpaceStore } from './stores/space';
import { onMounted, ref } from "vue";

useUIStore()

const isLoading = ref(true);
const fontStore = useFontStore()
const userStore = useUserStore();
const spaceStore = useSpaceStore();

onMounted(async () => {
  await userStore.autoLogin();
  await spaceStore.fetchHomepageSpaces()
  isLoading.value = false
})
</script>

<template>
  <template v-if="isLoading">
    Loading &hellip;
  </template>
  <template v-else>
    <teleport to="body">
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link v-if="fontStore.fontsUrl" :key="fontStore.fontsUrl" :href="fontStore.fontsUrl" rel="stylesheet" type="text/css" />
    </teleport>
    <RouterView />
  </template>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
