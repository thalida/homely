<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CallbackTypes } from "vue3-google-login";
import { useFontStore } from './stores/fonts';
import { useUserStore } from './stores/user';
import { useThemeStore } from './stores/theme';
import SpaceLayout from './components/SpaceLayout.vue'

useThemeStore()

const fontStore = useFontStore()
const userStore = useUserStore()
const isLoading = ref(true)

userStore.autoLogin().then(() => {
  isLoading.value = false
})

const spaces = computed(() => {
  return userStore.user?.spaces || []
})

const defaultSpaceId = computed(() => {
  return spaces.value && spaces.value.length > 0 ? spaces.value[0] : null
})

const callback: CallbackTypes.TokenResponseCallback = (response) => {
  userStore.loginWithGoogle(response.access_token)
};
</script>

<template>
  <main>
    <template v-if="isLoading">
      <div>
        Loading&hellip;
      </div>
    </template>
    <template v-else-if="!userStore.isAuthenticated">
      <GoogleLogin :callback="callback" popup-type="TOKEN">
        <button>Login Using Google</button>
      </GoogleLogin>
    </template>
    <template v-else-if="defaultSpaceId">
      <teleport to="body">
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link v-if="fontStore.fontsUrl" :key="fontStore.fontsUrl" :href="fontStore.fontsUrl" rel="stylesheet" type="text/css" />
      </teleport>
      <SpaceLayout :spaceId="defaultSpaceId" />
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
