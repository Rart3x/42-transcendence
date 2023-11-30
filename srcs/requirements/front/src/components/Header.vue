<script setup>
  import Cookies from "js-cookie";
  import Drawer from "./Drawer.vue";
  import Modal from "./Modal.vue";
  import { computed, onMounted, ref, unref } from "vue";
  import { RouterLink } from "vue-router";
  import { getAllUsers, getPrivateMessagesByUserName, getUserByCookie } from "./api/get.call.ts";
  import { createPrivateMessage, setStatus } from "./api/post.call.ts";

  let imageSrc = ref(null);

  let searchInput = ref("");

  const userName = ref("");

  let privateMessages = ref([]);
  let users = ref([]);

  let user = ref(null);

  let currentUserName = ref("");
  let senderName = ref("");
  let messageText = ref("");  

  let modalMessage = ref(false);

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
      console.error("error filtering users:", error);
      return [];
    }
  });

  const createPrivateMessageInDB = async (userName, senderName, message_text) => {
    const response = await createPrivateMessage(userName, senderName, message_text);
  };

  const logout = () => {
    Cookies.remove("_authToken");
    setStatus(user.value.userName, "offline");
    window.location.href = "/";
  };

  const closeMessageModal = () => { modalMessage.value = false; };
  const openMessageModal = (userName, sender) => { modalMessage.value = true; currentUserName = userName; senderName.value = sender;};

  onMounted(async () => {
    if (Cookies.get("_authToken") == undefined)
      return;
    user.value = await getUserByCookie(Cookies.get("_authToken"));
    userName.value = user.value.displayName;

    privateMessages.value = await getPrivateMessagesByUserName(user.value.userName);

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
      <Drawer :user="user" :imageSrc="imageSrc" :logout="logout" :display="false" :privateMessages="privateMessages"/>
    </div>
    <div class="navbar-center">
      <input type="text" placeholder="Search" class="font-mono input input-bordered w-24 md:w-auto" v-model="searchInput"/>
      <div v-show="searchInput" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <router-link v-for="user in filteredUsers" :key="user.id" :to="'/profile/' + user.userName" class="dropdown-item">{{ user.userName }}</router-link>
      </div>
    </div>
    <div class="navbar-end">
      <Drawer
        :user="user"
        :imageSrc="imageSrc"
        :logout="logout"
        :display="true"
        :privateMessages="privateMessages"
        :createPrivateMessageInDB="createPrivateMessageInDB"
        :openMessageModal="openMessageModal"
        :currentUserName="currentUserName"
        :modalMessage="modalMessage"
        :closeMessageModal="closeMessageModal"
        :senderName="senderName"
      />
      <Modal :senderName="senderName" />
    </div>
  </div>
</template>