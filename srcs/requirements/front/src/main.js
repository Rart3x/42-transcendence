import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/socket.js';
import { useStore } from 'vuex'

const app = createApp(App);
app.config.productionTip = false;

app.use(store).use(router).mount('#app');
store.dispatch('initializeSocket')
