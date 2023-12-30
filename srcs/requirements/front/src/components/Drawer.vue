<script>
  import { RouterLink } from "vue-router";
  import Modal from './Modal.vue';
  import { getAllUsers, getPrivateMessages} from "./api/get.call";

  export default {
    name: 'Drawer',
    components: {
      Modal
    },
    computed: {
      uniqueMessages() {
        const uniquePairs = {};
        for (const pairMessages of Object.values(this.privateMessages)) {
          const key = this.getPairKey(pairMessages);
          if (!uniquePairs[key]) {
            uniquePairs[key] = pairMessages;
          }
        }
        return Object.values(uniquePairs);
      }
    },
    data() {
      return {
        enteredName: '',
        messageText: '',
      };
    },
    methods: {
      async checkName() {
        const users = await getAllUsers(this.$props.jwtToken);
        const nameExists = users.some(user => user.userName === this.enteredName);

        if (nameExists) {
          const privateMessage = await getPrivateMessages(this.$props.user.userName, this.enteredName, this.$props.jwtToken);
          this.openMessageModal(this.$props.user.userName, privateMessage)
        }
      },
      getPairKey(pairMessages) {
        const sender = pairMessages[pairMessages.length - 1].senderName;
        const receiver = pairMessages[pairMessages.length - 1].receiverName;
        return sender < receiver ? `${sender}-${receiver}` : `${receiver}-${sender}`;
      },
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
          <li> <router-link to="/"> Home </router-link> </li>
          <li> <router-link to="/game"> Game </router-link> </li>
          <li> <router-link to="/leaderboard"> Leaderboard </router-link> </li>
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
            <img src="../assets/messages.png" />
          </div>
        </label>
      </button>
    </div> 
    <div class="drawer-side z-[1] font-mono">
      <label for="my-drawer-1" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <form @submit.prevent="checkName">
          <div class="p-4">
            <input v-model="enteredName" type="text" placeholder="Enter a name" class="input input-bordered w-full mb" @keyup.enter="checkName"/>
          </div>
        </form>
        <li v-for="(pairMessages, pairKey) in privateMessages" :key="pairKey" @click="openMessageModal(user.userName, pairMessages[pairMessages.length - 1])">
          <div class="flex justify-between items-center">
            <div class="flex flex-col items-start">
              <span class="font-semibold">
                  {{ pairMessages[pairMessages.length - 1].senderName === user.userName ? pairMessages[pairMessages.length - 1].receiverName : pairMessages[pairMessages.length - 1].senderName }}
              </span>
              <span v-if="pairMessages[pairMessages.length - 1].messageContent.length <= 20" class="text-sm text-gray-500">
                {{ pairMessages[pairMessages.length - 1].messageContent.substring(0, 20) }}
              </span>
              <span v-else class="text-sm text-gray-500">
                {{ pairMessages[pairMessages.length - 1].messageContent.substring(0, 20) }}..
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
      <li><router-link to="/about">About</router-link></li>
      <li><router-link to="/profile">Profile</router-link></li>
      <li><router-link to="/settings">Settings</router-link></li>
      <li><button @click="logout"><span class="font-bold">Logout</span></button></li>
    </ul>
  </div>
</template>

<style scoped>
  .font-semibold { font-weight: bold; }
  .text-sm { font-size: 0.875rem; }
  .text-gray-500 { color: #6b7280; }
</style>