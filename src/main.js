import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import VueApexCharts from 'vue3-apexcharts'
import { createPinia, setActivePinia } from 'pinia'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { setupAxiosInterceptors } from '@/api/axios'

const app = createApp(App)

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 })
const pinia = createPinia()
app.use(router)
app.use(pinia)
setActivePinia(pinia)
app.use(VueApexCharts)

setupAxiosInterceptors(router)

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored',
  zIndex: 9999999,
})

import { useSettingStore } from '@/stores/setting.js' // Import store setting
const settingStore = useSettingStore()
settingStore.fetchSettings()

app.mount('#app')
