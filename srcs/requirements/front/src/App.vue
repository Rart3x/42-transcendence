<script setup>
import Header from "@/components/Header.vue";
import Cookies from "js-cookie";
import { onMounted, ref } from "vue";
import { getUserByCookie } from "./components/api/get.call";
import "./assets/main.css"

let user = ref(null);

onMounted(async () => {
  user.value = await getUserByCookie(Cookies.get("_authToken"));
});
</script>

<template>
  <body>
    <Header v-if="user" />
    <router-view></router-view>
  </body>
</template>

<style scoped>
body {
  display: flex;
  flex-direction: column;
  background-color: #423e3e;
}
</style>
