import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import NasaLoader from './components/ui/NasaLoader.vue'
import './assets/styles/global.css'

createApp(App).use(router).component('NasaLoader', NasaLoader).mount('#app')
