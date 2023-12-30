<script setup>
  import Cookies from "js-cookie";
  import Header from "./components/Header.vue";
  import Footer from "./components/Footer.vue";
  import { onMounted, ref } from "vue";
  import { getUserByUserId } from "./components/api/get.call";
  import "./assets/main.css"

  const user = ref(null);

  onMounted(async () => {
    const cookieUserId = Cookies.get('UserId');
    const cookieJWT = Cookies.get('Bearer');

    if (cookieUserId !== undefined && cookieJWT !== undefined)
      user.value = await getUserByUserId(cookieUserId, cookieJWT);
  });
</script>

<template>
  <div class="wrapper">
    <body>
      <div class="main-content">
        <Header v-if="user" />
        <router-view></router-view>
        <Footer />
      </div>
    </body>
  </div>
</template>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex-grow: 1;
  }
</style>
