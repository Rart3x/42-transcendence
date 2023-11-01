<script setup>
  import Cookies from "js-cookie";
  import { getUserByCookie } from "./api/get.call";
  import { onMounted, ref } from "vue";

  let user = ref(null);

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));
  });

  const signInWithIntra = () => {
    window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${
      import.meta.env.VITE_CLIENT_ID
    }&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=code`;
  };

</script>

<template>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css" rel="stylesheet" type="text/css" />
  <div class="hero min-h-screen the-background-image">
  <div class="hero-overlay bg-opacity-60"></div>
  <div class="hero-content text-center text-neutral-content" v-if="!user">
    <div class="max-w-md">
      <button class="btn btn-glass" @click="signInWithIntra"> Sign in with 42 </button>
    </div>
  </div>
</div>
</template>

<style scoped>
.the-background-image {
  width: 100vw;
  height: 100vh;
  background-image: url('./images/kramjatt.jpg');
}
</style>