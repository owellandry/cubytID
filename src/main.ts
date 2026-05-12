import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { useUiStore } from './stores/uiStore'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

useUiStore(pinia).init()
app.mount('#app')
