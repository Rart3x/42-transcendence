<script setup>
  import Cookies from "js-cookie";
  import Drawer from "./Drawer.vue";
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
      <Drawer :user="user" :imageSrc="imageSrc" :logout="logout" :display="false"/>
    </div>
    <div class="navbar-center">
      <input type="text" placeholder="Search" class="font-mono input input-bordered w-24 md:w-auto" v-model="searchInput"/>
      <div v-show="searchInput" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <router-link v-for="user in filteredUsers" :key="user.id" :to="'/profile/' + user.userName" class="dropdown-item">{{ user.userName }}</router-link>
      </div>
    </div>
    <div class="navbar-end">
      <Drawer :user="user" :imageSrc="imageSrc" :logout="logout" :display="true"/>
    </div>
  </div>
</template>