import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import NasaLoader from './components/ui/NasaLoader.vue'
import BackButton from './components/ui/BackButton.vue'
import './assets/styles/global.css'

createApp(App)
  .use(router)
  .component('NasaLoader', NasaLoader)
  .component('BackButton', BackButton)
  .mount('#app')
