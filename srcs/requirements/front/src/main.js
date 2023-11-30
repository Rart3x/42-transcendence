import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.config.ignoredElements = [/ion-\w*/];
app.config.productionTip = false;

app.use(router);

app.mount("#app");