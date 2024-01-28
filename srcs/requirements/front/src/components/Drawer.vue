<script>
  import Alert from './Alert.vue';
  import Cookies from "js-cookie";
  import Modal from './Modal.vue';
  import { getAllUsers, getPrivateMessages, getUserByUserName, getUserByUserId } from "./api/get.call";
  import { RouterLink } from "vue-router";
  import { useStore } from "vuex";

  export default {
    name: 'Drawer',
    components: {
      Alert,
      Modal
    },
    computed: {
      uniqueMessages() {
        const uniquePairs = {};
        for (const [pairKey, pairMessages] of Object.entries(this.$props.privateMessages)) {
          const key = this.getPairKey(pairMessages);
          const newPrivateMessageDate = new Date(pairMessages.privateMessageDate);
          if (!uniquePairs[key] || new Date(uniquePairs[key].privateMessageDate) < newPrivateMessageDate)
            uniquePairs[key] = pairMessages;
        }
        return Object.values(uniquePairs);
      },
    },
    data() {
      return {
        enteredName: '',
        messageText: '',
        store: useStore(),

        cookieJWT: null,
        userNotFound: false,
        lastMessage: null,
        user: null
      };
    },
    methods: {
      async checkName() {
        const users = await getAllUsers(this.$props.jwtToken);
        const nameExists = users.some(user => user.userName === this.enteredName);

        const actualUser = await getUserByUserName(this.user.userName, this.$props.jwtToken);

        if (actualUser.blockUsers) {
          const blocked = actualUser.blockUsers.find(blockedUser => blockedUser.userName === this.enteredName);
          if (blocked) {
            this.userNotFound = true;
            setTimeout(() => this.userNotFound = false, 3000);
            return;
          }
        }

        if (nameExists && this.enteredName !== this.$props.user.userName ) {
          const privateMessage = await getPrivateMessages(this.$props.user.userName, this.enteredName, this.$props.jwtToken);
          this.openMessageModal(this.$props.user.userName, privateMessage);
          this.enteredName = ''
        }
        else {
          this.userNotFound = true;
          setTimeout(() => this.userNotFound = false, 3000);
        }
      },
      getPairKey(pairMessages) {
        const sender = pairMessages[pairMessages.length - 1].senderName;
        const receiver = pairMessages[pairMessages.length - 1].receiverName;
        return sender < receiver ? `${sender}-${receiver}` : `${receiver}-${sender}`;
      },
    },
    async mounted() {
      let cookieUserId = Cookies.get('UserId');
		  this.cookieJWT  = Cookies.get('Bearer');

      if (typeof cookieUserId !== 'undefined' && typeof this.cookieJWT !== 'undefined')
        this.user = await getUserByUserId(cookieUserId, this.cookieJWT);
    },
    props: {
      display : Boolean,
      modalMessage: Boolean,
      start: Boolean,
  
      privateMessages: Object,
      user: Object,

      currentUserName: String,
      displayName: String,
      senderName: String,
      userName: String,
      imageSrc: String,
      jwtToken: String,

      createPrivateMessageInDB: Function,
      logout: Function,
      openMessageModal: Function,
      closeMessageModal: Function,
    },
  };
</script>

<template>
  <Alert :userNotFound="userNotFound" />
  <Modal :parent="'drawer'" :modalMessage="modalMessage" :currentUserName="currentUserName" :senderName="senderName"
    :createPrivateMessageInDB="createPrivateMessageInDB" :closeMessageModal="closeMessageModal" :privateMessages="privateMessages" :userName="userName" :jwtToken="jwtToken"
  />
  <!--Game Drawer-->
  <div v-if="!display" class="drawer z-[1]">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
        <label for="my-drawer" tabindex="0" class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </label>
    </div> 
    <div class="drawer-side font-mono">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li> <router-link to="/"> <img src="../assets/home-svgrepo-com.svg" width="40" height="40"/>Home </router-link> </li>
          <li> <router-link to="/game"> <img src="../assets/arcade-game-pong-gaming-svgrepo-com.svg" width="36" height="36"/>  Game </router-link> </li>
          <li> <router-link to="/leaderboard"> <img src="../assets/leaderboard-star-svgrepo-com.svg" width="36" height="36"/>Leaderboard </router-link> </li>
        </ul>
    </div>
  </div>
  <!--Messages Drawer-->
  <div v-if="display" class="drawer-end z-[1] mr-4">
    <input id="my-drawer-1" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <button class="btn btn-ghost btn-circle">
        <label for="my-drawer-1" tabindex="0" class="btn btn-ghost btn-circle">
          <div class="indicator">
            <img src="../assets/messages-3-svgrepo-com.svg" width="36" height="36"/>
          </div>
        </label>
      </button>
    </div> 
    <div class="drawer-side z-[1] font-mono">
      <label for="my-drawer-1" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <form name="checkName" @submit.prevent="checkName">
          <div class="p-4">
            <input name="startConv" v-model="enteredName" type="text" placeholder="Start a conversation" class="input input-bordered w-full mb"/>
            <button type="submit" class="btn btn-primary w-full mt-2">Search</button>
          </div>
        </form>
        <li v-for="(pairMessages, pairKey) in uniqueMessages" :key="pairKey" @click="openMessageModal(user.userName, pairMessages[pairMessages.length - 1])">
          <div class="flex justify-between items-center">
            <div class="flex flex-col items-start">
              <span class="font-semibold">
                {{ pairMessages[pairMessages.length - 1].senderName === user.userName ? pairMessages[pairMessages.length - 1].receiverName : pairMessages[pairMessages.length - 1].senderName }}
              </span>
            </div>
            <span>{{ pairMessages[pairMessages.length - 1].privateMessageDate.substring(11, 16) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <!--Settings Dropdown-->
  <div v-if="!start">
    <span v-if="displayName" tabindex="0" class="lowercase text-xl mr-4 ">{{ displayName }}</span>
    <span v-else-if="user.userName" tabindex="0" class="lowercase text-xl mr-4 ">{{ user.userName }}</span>
  </div>
  <div v-if="display" class="dropdown dropdown-end">
    <div class="flex flex-row items-center">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img :src="imageSrc" />
        </div>
      </div>
    </div>
    <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 w-52">
      <li><router-link to="/profile">Profile <img src="../assets/profile-1335-svgrepo-com.svg" width="30" height="30"/></router-link></li>
      <li><router-link to="/settings">Settings <img src="../assets/settings-svgrepo-com.svg" width="32" height="32"/></router-link></li>
      <li><button @click="logout"><span class="font-bold">Logout </span> <img src="../assets/logout-2-svgrepo-com.svg" width="32" height="32"/></button></li>
    </ul>
  </div>
</template>

<style scoped>
  .font-semibold { font-weight: bold; }
  .invisible { display:none; visibility: hidden; }
  .text-sm { font-size: 0.875rem; }
  .text-gray-500 { color: #6b7280; }
</style>