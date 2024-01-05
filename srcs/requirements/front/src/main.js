import App from './App.vue';
import router from './router/index.js';
import store from './store/store.js';
import { createApp } from 'vue';

const app = createApp(App);
app.config.productionTip = false;

app.use(store).use(router).mount('#app');

store.dispatch('initializeSocket');