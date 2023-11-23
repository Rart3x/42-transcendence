<script setup>
  import Cookies from "js-cookie";
  import { computed } from "vue";
  import { onMounted, ref, unref } from "vue";
  import { RouterLink, RouterView } from "vue-router";
  import { getUserByCookie, getAllUsers } from "./api/get.call.ts";
  import { setStatus } from "./api/post.call.ts";


  const userName = ref("");
  let user = ref(null);
  let imageSrc = ref(null);
  let users = ref([]);
  let searchInput = ref("");

  const filteredUsers = computed(() => {
    if (!users.value)
      return [];
    try {
      const searchInputValue = unref(searchInput);
      if (!searchInputValue || !users.value)
        return [];
      return users.value.filter(user =>
        user.userName && user.userName.includes(searchInputValue) ||
        user.displayName && user.displayName.includes(searchInputValue)
      );
    }
    catch (error) {
      console.error("Error filtering users:", error);
      return [];
    }
  });

  const logout = () => {
    Cookies.remove("_authToken");
    setStatus(user.value.userName, "offline");
    window.location.href = "/";
  };

  onMounted(async () => {
    if (Cookies.get("_authToken") == undefined)
      return;
    user.value = await getUserByCookie(Cookies.get("_authToken"));
    userName.value = user.value.displayName;
    let imagePath = "../assets/userImages/" + user.value.image;
    import(/* @vite-ignore */ imagePath).then((image) => {
      imageSrc.value = image.default;
    });
    const allUsers = await getAllUsers();
    users.value = allUsers;
  });

</script>

<template>

  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="drawer">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <label for="my-drawer" tabindex="0" class="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </label>
        </div> 
        <div class="drawer-side">
          <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <li> <router-link to="/"> Home </router-link> </li>
            <li> <router-link to="/game"> Game </router-link> </li>
            <li> <router-link to="/leaderboard"> Leaderboard </router-link> </li>
            <li> <router-link to="/about"> About </router-link> </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="navbar-center">
      <input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" v-model="searchInput"/>
      <div v-show="searchInput" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <router-link v-for="user in filteredUsers" :key="user.id" :to="'/profile/' + user.userName" class="dropdown-item">{{ user.userName }}</router-link>
      </div>
    </div>
    <div class="navbar-end">
      <div class="drawer-end">
        <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <label for="my-drawer-4" tabindex="0" class="btn btn-ghost btn-circle">
            <div class="avatar">
              <div class="w-15 mask mask-squircle">
                <img :src="imageSrc" />
              </div>
            </div>
          </label>
        </div> 
        <div class="drawer-side">
          <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <li> <router-link to="/profile"> Profile </router-link> </li>
            <li> <router-link to="/history"> History </router-link> </li>
            <li> <router-link to="/settings"> Settings </router-link> </li>
            <li> <button @click="logout">Logout</button> </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>