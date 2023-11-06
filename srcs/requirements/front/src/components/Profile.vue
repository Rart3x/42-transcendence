<script setup>
  import { onMounted, ref } from 'vue';
  import { getUserByUsername } from './api/get.call';
  import { useRoute } from 'vue-router';

  let actualUser = ref(null);

  const route = useRoute();

  onMounted(async () => {
    actualUser.value = await getUserByUsername(route.params.userName);
    let imagePath = "../assets/userImages/" + actualUser.value.image;
    await import(/* @vite-ignore */ imagePath).then((image) => {
      actualUser.value.image = image.default;
    });
  });

</script>

<template>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css" rel="stylesheet" type="text/css" />
  <!--Stats-->
  <div class="stats shadow">
    <div class="stat">
      <div class="stat-figure text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </div>
      <div class="stat-title">Username</div>
      <div class="stat-value">{{ $route.params.userName }}</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </div>
      <div class="stat-title">Games Total</div>
      <div class="stat-value">0</div>
    </div>
    
    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div class="stat-title">Games won</div>
      <div class="stat-value">0</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div class="stat-title">Winrate</div>
      <div class="stat-value">0%</div>
    </div>
  </div>
</template>

<style>
  .addingFriend {
    text-align: center;
  }

  .dialogModalChannel { 
    text-align:center;
  }
  .rounded-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
  }

  .rounded-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
</style>