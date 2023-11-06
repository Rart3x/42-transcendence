<script setup>
  import { RouterLink, RouterView } from "vue-router";
  import { onMounted, ref, unref } from "vue";
  import Cookies from "js-cookie";
  import { getUserByCookie, getAllUsers } from "./api/get.call.ts";
  import { computed } from "vue";

  const userName = ref("");
  let user = ref(null);
  let imageSrc = ref(null);
  let users = ref([]);
  let searchInput = ref("");

  const filteredUsers = computed(() => {
    if (!users.value) {
      return [];
    }
    try {
      const searchInputValue = unref(searchInput);
      if (!searchInputValue || !users.value) {
        return [];
      }
      return users.value.filter(user =>
        user.userName && user.userName.includes(searchInputValue) ||
        user.displayName && user.displayName.includes(searchInputValue)
      );
    } catch (error) {
      console.error("Error filtering users:", error);
      return [];
    }
  });

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
    const allUsers = await getAllUsers();
    users.value = allUsers;
    console.log("users: ", users.value)
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
      <router-link to="/" class="btn btn-ghost normal-case text-xl">
         <a class="Navbar-content">PMT</a>
      </router-link>
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
            <router-link to="/"> Home </router-link>
          </li>
          <li>
            <router-link to="/game"> Game </router-link>
          </li>
          <li>
            <router-link to="/about"> About </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <div class="dropdown">
        <input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" v-model="searchInput"/>
        <div v-show="searchInput" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <router-link v-for="user in filteredUsers" :key="user.id" :to="'/profile/' + user.userName" class="dropdown-item" >
            {{ user.userName }}
          </router-link>
        </div>
      </div>
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
            <router-link to="/profile"> Profile </router-link>
          </li>
          <li>
              <router-link to="/settings"> Settings </router-link>
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
