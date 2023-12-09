<script setup>
  import Alert from "./Alert.vue";
  import Cookies from "js-cookie";
  import Drawer from "./Drawer.vue";
  import Modal from "./Modal.vue";
  import { computed, onMounted, ref, unref } from "vue";
  import { RouterLink } from "vue-router";
  import { getAllUsers, getPrivateMessagesByUserName, getUserByCookie } from "./api/get.call.ts";
  import { createPrivateMessage, setStatus, setClientSocket } from "./api/post.call.ts";

  let imageSrc = ref(null);
  let modalMessage = ref(false);
  let privateMessages = ref([]);
  let searchInput = ref("");

  let user = ref(null);
  let users = ref([]);

  let currentUserName = ref("");
  let senderName = ref("");
  const userName = ref("");

  let invitationInGameSuccess = ref(false);
  let inviteInGameSuccess = ref(false);

  let inviteInGameFailed = ref(false);


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
      return [];
    }
  });

  const createPrivateMessageInDB = async (userName, senderName, message_text) => {
    const response = await createPrivateMessage(userName, senderName, message_text);
    privateMessages.value = await getPrivateMessagesByUserName(user.value.userName);
  };

  const logout = () => {
    Cookies.remove("_authToken");
    setStatus(user.value.userName, "offline");
    window.location.href = "/";
  };

  const closeMessageModal = () => { modalMessage.value = false; };
  const openMessageModal = (userName, message) => { modalMessage.value = true; currentUserName = userName; senderName.value = (message.senderName === userName) ? message.receiverName : message.senderName; };

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
    users.value = await getAllUsers();
  });

</script>

<template>
  <Alert :inviteInGameFailed="inviteInGameFailed" :inviteInGameSuccess="inviteInGameSuccess" :invitationInGameSuccess="invitationInGameSuccess" />
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <Drawer :user="user" :imageSrc="imageSrc" :logout="logout" :display="false" :privateMessages="privateMessages" :userName="userName"/>
    </div>
    <div class="navbar-center">
      <input type="text" placeholder="Search" class="font-mono input input-bordered w-24 md:w-auto" v-model="searchInput"/>
      <div v-show="searchInput" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <router-link v-for="user in filteredUsers" :key="user.id" :to="'/profile/' + user.userName" class="dropdown-item">{{ user.userName }}</router-link>
      </div>
    </div>
    <div class="navbar-end">
      <Drawer
        :display="true"
        :imageSrc="imageSrc"
        :user="user"

        :currentUserName="currentUserName"
        :senderName="senderName"
        :userName="userName"

        :closeMessageModal="closeMessageModal"
        :modalMessage="modalMessage"
        :openMessageModal="openMessageModal"
        :privateMessages="privateMessages"

        :createPrivateMessageInDB="createPrivateMessageInDB"
        :logout="logout"
      />
      <Modal :senderName="senderName" />
    </div>
  </div>
</template>