<script setup lang="ts">
import axios from 'axios';
import SpaceLayout from './components/SpaceLayout.vue'
import { useFontStore } from './stores/fonts';
import type { CallbackTypes } from "vue3-google-login";

axios.defaults.withCredentials = true;

const fontStore = useFontStore()

const callback: CallbackTypes.TokenResponseCallback = (response) => {
  console.log("Access token", response.access_token);

  axios.post('http://localhost:8000/api/auth/google/', {
    access_token:  response.access_token,
    // id_token: response.access_token,
  }, {
    withCredentials: true,
  })
};
</script>

<template>
  <main>
    <GoogleLogin :callback="callback" popup-type="TOKEN">
      <button>Login Using Google</button>
    </GoogleLogin>
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
