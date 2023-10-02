import "./assets/main.css";

import axios from 'axios';
import { createApp } from "vue";
import router from "./router";

import App from "./App.vue";
import Home from "@/components/Home.vue";
import Game from "@/components/Game.vue";
import About from "@/components/About.vue";
import Profile from "@/components/Profile.vue";

const app = createApp(App);
app.config.ignoredElements = [/ion-\w*/];
app.config.productionTip = false;

app.use(router);

app.mount("#app");