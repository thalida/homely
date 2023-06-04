import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { GesturePlugin } from '@vueuse/gesture'
import { MotionPlugin } from '@vueuse/motion'
import vue3GoogleLogin from 'vue3-google-login'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from './router'

import 'vue3-lottie/dist/style.css'
import 'primevue/resources/themes/lara-light-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue)
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_OAUTH2_CLIENT_ID,
});
app.use(GesturePlugin)
app.use(MotionPlugin)
app.use(router);

app.mount('#app')
