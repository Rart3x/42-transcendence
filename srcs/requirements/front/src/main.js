import App from './App.vue';
import router from './router';
import store from './store/socket.js';
import { createApp } from 'vue';

const app = createApp(App);
app.config.productionTip = false;

app.use(store).use(router).mount('#app');
store.dispatch('initializeSocket');