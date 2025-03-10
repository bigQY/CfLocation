import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './lang/index.js'

const app = createApp(App)
app.use(i18n)
app.mount('#app')
