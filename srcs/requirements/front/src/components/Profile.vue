<script setup>
  import Cookies from "js-cookie";
  import { onMounted, ref } from "vue";
  import { getAllFriends, getUserByCookie } from "./api/get.call";
  import { addFriend, removeFriend } from './api/post.call';

  const isChecked = ref(false);
  const friendName = ref("");
  const userName = ref("");

  let friends = ref([]);
  let user = ref(null);

  onMounted(async () => {
    user = await getUserByCookie(Cookies.get("_authToken"));
    if (!user)
      window.location.href = "/";
    userName.value = user.displayName;

    friends = await getAllFriends(userName.value);

    for (user of friends.value) {
      const imagePath = `../assets/userImages/${user.image}`;
      import(/* @vite-ignore */ imagePath).then((image) => {
        user.image = image.default;
      });
    }
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
        <form @submit.prevent="test">
          <label class="btn btn-info btn-circle swap swap-rotate">
            <input type="checkbox"/>
            <svg class="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
            <svg class="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
          </label>
        </form>
    </div>

    <div class="stat">
      <div class="stat-figure text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </div>
      <div class="stat-title">Games Total</div>
      <div class="stat-value text-primary">0</div>
    </div>
    
    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div class="stat-title">Games won</div>
      <div class="stat-value text-secondary">0</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div class="stat-title">Winrate</div>
      <div class="stat-value text-secondary">0%</div>
    </div>
  </div>

  <!--Friends List -->
  <div class="overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          <th>
            <form @submit.prevent="addFriend(userName, friendName)">
              <button class="btn btn-primary">Add Friend</button>
              <input type="text" id="friendName" v-model="friendName" class="input input-bordered w-full max-w-xs" />
            </form>
          </th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(user, index) in friends" :key="index">
        <th>
          <label>
            <input type="checkbox" class="checkbox" v-model="user.isChecked" />
          </label>
        </th>
        <td>
          <div class="flex items-center space-x-3">
            <div class="rounded-image">
              <img :src="user.image" alt="User Image" />
            </div>
          </div>
        </td>
        <td>
          <button class="btn no-animation">{{ user.userName }}</button>
        </td>
        <td>
          <div v-if="user.isChecked" class="profile">
            <button class="btn btn-error" @click="removeFriend(userName, user.userName)">Delete Friend</button>
          </div>
          <div v-else class="profile">
            <button class="btn btn-info">Visit Profile</button>
          </div>
        </td>
        <td>
          <button class="btn btn-primary">Invite in Game</button>
        </td>
      </tr>
    </tbody>
    </table>
  </div>
</template>

<style>
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