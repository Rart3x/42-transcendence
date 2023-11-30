<script>
  import { RouterLink } from "vue-router";
  import Modal from './Modal.vue';

    export default {
    name: 'Drawer',
    components: {
      Modal
    },
    data() {
      return {
        messageText: '',
      };
    },
    props: {
      display : Boolean,
      modalMessage: Boolean,

      notifs: Array,
      privateMessages: Array,

      user: Object,

      currentUserName: String,
      senderName: String,
      imageSrc: String,

      createPrivateMessageInDB: Function,
      logout: Function,
      openMessageModal: Function,
      closeMessageModal: Function,
    },
  };
</script>

<template>
  <Modal :parent="'drawer'" :modalMessage="modalMessage" :currentUserName="currentUserName" :senderName="senderName"
    :createPrivateMessageInDB="createPrivateMessageInDB" :closeMessageModal="closeMessageModal" 
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
  <div v-if="display" class="drawer-end z-[1]">
    <input id="my-drawer-1" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <button class="btn btn-ghost btn-circle">
        <label for="my-drawer-1" tabindex="0" class="btn btn-ghost btn-circle">
          <div class="indicator">
            <img src="../assets/messages.png" />
            <span class="badge badge-xs badge-error indicator-item"></span>
          </div>
        </label>
      </button>
    </div> 
    <div class="drawer-side z-[1] font-mono">
      <label for="my-drawer-1" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <li v-for="(messageObject, index) in privateMessages" :key="index" class="message_boxes" @click="openMessageModal(user.userName, messageObject.senderName)">
          <div class="flex justify-between items-center">
            <div class="flex flex-col items-start">
              <span class="font-semibold">{{ messageObject.senderName }}</span>
              <span v-if="messageObject.messageHistory[messageObject.messageHistory.length - 1].length <= 20" class="text-sm text-gray-500">{{ messageObject.messageHistory[messageObject.messageHistory.length - 1].substring(0, 20) }}</span>
              <span v-else class="text-sm text-gray-500">{{ messageObject.messageHistory[messageObject.messageHistory.length - 1].substring(0, 20) }}..</span>
            </div>
            <span>{{ messageObject.privateMessageDate.substring(11, 16) }} </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <!--Notifs Drawer-->
  <div v-if="display" class="drawer-end">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <button class="btn btn-ghost btn-circle">
        <label for="my-drawer-2" tabindex="0" class="btn btn-ghost btn-circle">
          <div class="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span class="badge badge-xs badge-error indicator-item"></span>
          </div>
        </label>
      </button>
    </div> 
    <div class="drawer-side z-[1] font-mono">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <li v-for="(notification, index) in notifs" :key="index" class="notification_boxes">
          <div class="flex justify-between items-center">
            <div class="flex flex-col items-start">
              <span class="text-sm text-gray-500">{{ notification.notif }}</span>
            </div>
            <span>{{ notification.notifDate.substring(11, 16) }} </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <!--Settings Drawer-->
  <div v-if="display" class="drawer-end">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <label for="my-drawer-3" tabindex="0" class="btn btn-ghost btn-circle">
        <div class="avatar">
          <div class="w-15 mask mask-squircle">
            <img :src="imageSrc" />
          </div>
        </div>
      </label>
    </div> 
    <div class="drawer-side z-[1] font-mono">
      <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <li> <router-link to="/about"> About </router-link> </li>
        <li> <router-link to="/profile"> Profile </router-link> </li>
        <li> <router-link to="/settings"> Settings </router-link> </li>
        <li> <button @click="logout">Logout</button> </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
  .font-semibold { font-weight: bold; }
  .text-sm { font-size: 0.875rem; }
  .text-gray-500 { color: #6b7280; }
</style>