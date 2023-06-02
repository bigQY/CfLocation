import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import i18n from './lang/index.js'

const app = createApp(App)
app.use(Antd)
app.use(i18n)
app.mount('#app')
