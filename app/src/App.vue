<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from "vue-router";
import { useFontStore } from './stores/fonts';
import { useUserStore } from './stores/user';
import { useThemeStore } from './stores/theme';
import { useSpaceStore } from './stores/space';

useThemeStore()

const fontStore = useFontStore()
const userStore = useUserStore()
const spaceStore = useSpaceStore()
const isLoading = ref(true)

userStore.autoLogin().then(async () => {
  await spaceStore.fetchHomepageSpaces()
  isLoading.value = false
})
</script>

<template>
  <main>
    <template v-if="isLoading">
      <div>
        Loading&hellip;
      </div>
    </template>
    <template v-else>
      <teleport to="body">
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link v-if="fontStore.fontsUrl" :key="fontStore.fontsUrl" :href="fontStore.fontsUrl" rel="stylesheet" type="text/css" />
      </teleport>
      <RouterView />
    </template>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
