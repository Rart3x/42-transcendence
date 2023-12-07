import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/socket.js';

const app = createApp(App);

app.config.ignoredElements = [/ion-\w*/];
app.config.productionTip = false;

app.use(router);
app.use(store);

app.mount('#app');