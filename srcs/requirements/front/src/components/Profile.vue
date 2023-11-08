<script setup>
  import Cookies from "js-cookie";
  import { onMounted, ref } from 'vue';
  import { isFriend, getUserByCookie, getUserByName } from './api/get.call';
  import { addFriend } from './api/post.call';
  import { useRoute } from 'vue-router';

  let actualUser = ref(null);
  let user = ref(null);

  let addFriendSuccess = false;

  const route = useRoute();

  const addFriendFromDB = async (userName, friendName) => {
    const response = await addFriend(userName, friendName);
    if (response.ok)
      addFriendSuccess = true;
    else
      addFriendSuccess = false;
    // friendName.value = "";
  };

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));
    actualUser.value = await getUserByName(route.params.userName);
  
    let imagePath = "../assets/userImages/" + actualUser.value.image;
    await import(/* @vite-ignore */ imagePath).then((image) => {
      actualUser.value.image = image.default;
    });
  });

</script>

<template>
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
  <br>
  <!-- <div class="addFriend" v-if="isFriend(user.value.userName, $route.params.userName)">
    <button class="btn" @click="addFriendFromDB(user.value.userName, $route.params.userName)">Add {{ $route.params.userName }}</button>
  </div> -->
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