<script setup>
  import Cookies from "js-cookie";
  import Header from "@/components/Header.vue";
  import Footer from "@/components/Footer.vue";
  import { onMounted, ref } from "vue";
  import { getUserByUserId } from "./components/api/get.call";
  import "./assets/main.css"

  let user = ref(null);

  onMounted(async () => {
    let cookieUserId = Cookies.get('UserId');
    let cookieJWT = Cookies.get('Bearer');

    if (typeof cookieUserId !== 'undefined' && typeof cookieJWT !== 'undefined'){
      user.value = await getUserByUserId(cookieUserId, cookieJWT);
    }
  });
</script>

<template>
  <body>
    <Header v-if="user" />
    <router-view></router-view>
  </body>
  <Footer></Footer>
</template>
