import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/socket.js';

const app = createApp(App);
app.config.productionTip = false;

app.use(store);
app.use(router);
app.mount('#app');