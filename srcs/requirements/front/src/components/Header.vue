<script setup>
  import { RouterLink, RouterView } from "vue-router";
  import { onMounted, ref } from "vue";
  import Cookies from "js-cookie";
  import { getUserByCookie } from "./api/get.call.ts";

  const userName = ref("");
  let user = ref(null);
  let imageSrc = ref(null);

  const logout = () => {
    Cookies.remove("_authToken");
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
  });

  const dropdownOpen = ref(false);
  const picDropdownOpen = ref(false);

  const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
  };

  const picToggleDropdown = () => {
    picDropdownOpen.value = !picDropdownOpen.value;
  };

</script>

<template>
  <link
    href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css"
    rel="stylesheet"
    type="text/css"
  />
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown" @click="picToggleDropdown">
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
        <ul v-if="picDropdownOpen" tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <a>
              <router-link to="/"> Home </router-link>
            </a>
          </li>
          <li>
            <a>
              <router-link to="/game"> Game </router-link>
            </a>
          </li>
          <li>
            <a>
              <router-link to="/about"> About </router-link>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <a class="btn btn-ghost normal-case text-xl">
        <router-link to="/" class="Navbar-content">PMT</router-link>
      </a>
    </div>
    <div class="navbar-end">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle" @click="toggleDropdown">
          <div class="avatar">
            <div class="w-24 mask mask-squircle">
              <img :src="imageSrc" />
            </div>
          </div>
        </label>
        <ul v-if="dropdownOpen" tabindex="1" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <a>
              <router-link to="/profile"> Profile </router-link>
            </a>
          </li>
          <li>
            <a>
              <router-link to="/settings"> Settings </router-link>
            </a>
          </li>
          <li>
            <button @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar-end {
  width: 50%;
  justify-content: flex-end;
}

.dropdown-content {
  z-index: 1;
}

</style>
