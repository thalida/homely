import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { GesturePlugin } from '@vueuse/gesture'
import { MotionPlugin } from '@vueuse/motion'
import vue3GoogleLogin from 'vue3-google-login'
import Vue3Lottie from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
import App from './App.vue'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(Vue3Lottie, { name: "Vue3Lottie" })
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_OAUTH2_CLIENT_ID,
});
app.use(GesturePlugin)
app.use(MotionPlugin)

app.mount('#app')
