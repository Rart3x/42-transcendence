<script>
  import Alert from "./Alert.vue";
  import Cookies from "js-cookie";
  import Drawer from "./Drawer.vue";
  import Modal from "./Modal.vue";
  import { inviteFriendInGameEXPORT, socketOnEXPORT } from "./UserProfile.vue";
  import { getAllUsers, getPrivateMessagesByUserName, getUserByUserId, getUserByUserName, getImage } from "./api/get.call.ts";
  import { createPrivateMessage, setStatus, setClientSocket } from "./api/post.call.ts";
  import { RouterLink } from "vue-router";
  import axios from 'axios';

  export default {
    name: 'Header',
    components: {
      Alert,
      Drawer,
      Modal,
    },
    data() {
      return {
        imageSrc: null,
        modalMessage: false,
        privateMessages: [],
        searchInput: "",
        user: null,
        users: [],
        currentUserName: "",
        senderName: "",
        userName: "",
        invitationInGameSuccess: false,
        inviteInGameSuccess: false,
        inviteInGameFailed: false,
        cookieJWT: null
      };
    },
    computed: {
      filteredUsers() {
        if (!this.users)
          return [];
        try {
          const searchInputValue = this.searchInput;
          if (!searchInputValue || !this.users)
            return [];
          return this.users.filter(user =>
            user.userName && user.userName.includes(searchInputValue) ||
            user.displayName && user.displayName.includes(searchInputValue)
          );
        }
        catch (error) {
          return [];
        }
      }
    },
    methods: {
      createPrivateMessageInDB(userName, senderName, message_text) {
        if (message_text === "/game") { 
          const user1 = getUserByUserName(senderName, this.cookieJWT);
          message_text = "";
          this.modalMessage = false;
          inviteFriendInGameEXPORT(user1.userName, user1.userId, user1.userSocket, user1.userStatus, this.user, this.cookieJWT);
        }
        const response = createPrivateMessage(userName, this.user.userName, message_text, this.cookieJWT);
        this.privateMessages = getPrivateMessagesByUserName(this.user.userName, this.cookieJWT);
      },
      logout() {
        Cookies.remove("UserId");
        Cookies.remove("Bearer");
        setStatus(this.user.userName, "offline", this.cookieJWT);
        window.location.href = "/";
      },
      closeMessageModal() { this.modalMessage = false; },
      openMessageModal(userName, message) { this.modalMessage = true; this.currentUserName = userName; this.senderName = (message.senderName === userName) ? message.receiverName : message.senderName; },
    },
    async mounted() {
      let cookieUserId = Cookies.get('UserId');
		  this.cookieJWT = Cookies.get('Bearer');

      if (typeof cookieUserId !== 'undefined' && typeof this.cookieJWT !== 'undefined'){
        this.user = await getUserByUserId(cookieUserId, this.cookieJWT);
      }
      this.userName = this.user.displayName;
      this.privateMessages = await getPrivateMessagesByUserName(this.user.userName, this.cookieJWT);
      this.imageSrc = await getImage(this.user.image);
      this.users = await getAllUsers(this.cookieJWT);
    }
  };
</script>

<template>
  <Alert :inviteInGameFailed="inviteInGameFailed" :inviteInGameSuccess="inviteInGameSuccess" :invitationInGameSuccess="invitationInGameSuccess" />
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <Drawer :user="user" :imageSrc="imageSrc" :logout="logout" :display="false" :privateMessages="privateMessages" :userName="userName" :jwtToken="cookieJWT" :start="true"/>
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
        :jwtToken="cookieJWT"

        :currentUserName="currentUserName"
        :displayName="user.displayName"
        :senderName="senderName"
        :userName="userName"

        :closeMessageModal="closeMessageModal"
        :modalMessage="modalMessage"
        :openMessageModal="openMessageModal"
        :privateMessages="privateMessages"

        :createPrivateMessageInDB="createPrivateMessageInDB"
        :logout="logout"

        :start="false"
      />
      <Modal :senderName="senderName" :jwtToken="cookieJWT" :userName="userName"/>
    </div>
  </div>
</template>