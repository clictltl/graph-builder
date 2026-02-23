import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css' // (Opcional: pode manter ou apagar se quiser limpar o CSS padrão)
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')