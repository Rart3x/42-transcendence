<script setup>
  import { ref } from 'vue';

  const signInWithIntra = () => {
    window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${
      import.meta.env.VITE_CLIENT_ID
    }&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=code`;
  };

</script>

<template>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css" rel="stylesheet" type="text/css" />
  <div class="hero min-h-screen" style="background-image: url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg);">
  <div class="hero-overlay bg-opacity-60"></div>
  <div class="hero-content text-center text-neutral-content">
    <div class="max-w-md">
      <img src="@/components/icons/SignIn.png" @click="signInWithIntra" class="sign"/>
    </div>
  </div>
</div>
</template>

<style scoped></style>