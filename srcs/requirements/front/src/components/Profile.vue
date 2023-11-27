<script setup>
  import Alert from './Alert.vue';
  import UserStatHeader from "./UserStatHeader.vue";
  import Cookies from "js-cookie";
  import { ref, onMounted } from 'vue';
  import { removeFriend } from './api/delete.call';
  import { isBlock, isFriend, getPrivateMessages, getUserByCookie, getUserByUserName } from './api/get.call';
  import { addFriend, blockUser, createChannel, createPrivateMessage, unblockUser } from './api/post.call';
  import { useRoute } from 'vue-router';

  let actualUser = ref(null);
  let user = ref(null);

  let addChannelSuccess = ref(false);
  let addFriendSuccess = ref(false);
  let blockSuccess = ref(false);
  let removeFriendSuccess = ref(false);
  let unblockSuccess = ref(false);

  let addChannelFailed = ref(false);
  let addFriendFailed = ref(false);
  let blockFailed = ref(false);
  let removeFriendFailed = ref(false);
  let unblockFailed = ref(false);

  let isFriendBool = ref(false);
  let isBlockBool = ref(false);

  const route = useRoute();

  const channelName = ref(null);
  const modalChannel = ref(false);

  let messages = ref([]);
  let message_text = ref(null);

  const addFriendFromDB = async (userName, friendName) => {
    const response = await addFriend(userName, friendName);

    if (response && response.success) {
      addFriendSuccess.value = true;
      setTimeout(() => {
        addFriendSuccess.value = false;
      }, 3000);
      isFriendBool.value = true;
    } 
    else {
      addFriendFailed.value = true;
      setTimeout(() => {
        addFriendFailed.value = false;
      }, 3000);
    }
  };

  const blockFromDB = async (userName, blockedUserName) => {
    const response = await blockUser(userName, blockedUserName);

    if (response && response.success) {
      blockSuccess.value = true;
      setTimeout(() => {
        blockSuccess.value = false;
      }, 3000);
      isBlockBool.value = true;
      await removeFriendFromDB(userName, blockedUserName);
    } 
    else {
      blockFailed.value = true;
      setTimeout(() => {
        blockFailed.value = false;
      }, 3000);
      isBlockBool.value = false;
    }
  };

  const createChannelInDB = async (channelName, userName, currentUserName) => {
    const response = await createChannel(channelName, userName, currentUserName);
    modalChannel.value = false;

    if (response && response.success) {
      addChannelSuccess.value = true;
      setTimeout(() => {
        addChannelSuccess.value = false;
      }, 3000);
    } 
    else {
      addChannelFailed.value = true;
      setTimeout(() => {
        addChannelFailed.value = false;
      }, 3000);
    }
  };

  const createPrivateMessageInDB = async (userName, receiverName, message_text) => {
    const response = await createPrivateMessage(userName, receiverName, message_text);

    message_text = "";//Devrait effacer le contenu de la box, a voir
    messages.value = await getPrivateMessages(userName, receiverName);
  };

  const isBlockFromDB = async (userName, blockedUserName) => {
    const response = await isBlock(userName, blockedUserName);

    if (response && response.success)
      isBlockBool.value = true;
    else
      isBlockBool.value = false;
  };

  const isFriendFromDB = async (userName, friendName) => {
    const response = await isFriend(userName, friendName);

    if (response && response.success)
      isFriendBool.value = true;
    else
      isFriendBool.value = false;
  };

  const openChannelModal = (userName) => {
    modalChannel.value = true;
    currentUserName = userName;
  };

  const removeFriendFromDB = async (userName, friendName) => {
    const response = await removeFriend(userName, friendName);
    
    if (response && response.success) {
      removeFriendSuccess.value = true;
      setTimeout(() => {
        removeFriendSuccess.value = false;
      }, 3000);
      isFriendBool.value = false;
    } 
    else {
      removeFriendFailed.value = true;
      setTimeout(() => {
        removeFriendFailed.value = false;
      }, 3000);
    }
  };

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));
    actualUser.value = await getUserByUserName(route.params.userName);
    
    isFriendBool.value = isFriendFromDB(user.value.userName, actualUser.value.userName).sucess;
    isBlockBool.value = isBlockFromDB(user.value.userName, actualUser.value.userName).sucess;
    
    messages.value = await getPrivateMessages(user.value.userName, actualUser.value.userName);

    let imagePath = "../assets/userImages/" + actualUser.value.image;
    await import(/* @vite-ignore */ imagePath).then((image) => {
      actualUser.value.imageSrc = image.default;
    });

    let imagePathUser = "../assets/userImages/" + user.value.image;
    await import(/* @vite-ignore */ imagePathUser).then((image) => {
      user.value.imageSrc = image.default;
    });

  });

  const unblockFromDB = async (userName, unblockedUserName) => {
    const response = await unblockUser(userName, unblockedUserName);

    if (response && response.success) {
      unblockSuccess.value = true;
      setTimeout(() => {
        unblockSuccess.value = false;
      }, 3000);
      isBlockBool.value = false;
    } 
    else {
      unblockFailed.value = true;
      setTimeout(() => {
        unblockFailed.value = false;
      }, 3000);
      isBlockBool.value = true;
    }
  };
</script> 

<template>
  <!--Stats-->
  <UserStatHeader v-if="user"
    :userName="userName"
    :gamePlayed="user.gamePlayed"
    :gameWon="user.gameWon"
  />
  <div class="stats shadow">
    <div class="stat" v-if="!isBlockBool">
      <button class="btn" v-if="user && !isFriendBool" @click="addFriendFromDB(user.userName, $route.params.userName)">
        Add {{ $route.params.userName }}
      </button>
      <button class="btn btn-error" v-else="user && isFriendFromDB(user.userName, $route.params.userName)" @click="removeFriendFromDB(user.userName, $route.params.userName)">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        Remove {{ $route.params.userName }}
      </button>
    </div>
    <div class="stat" v-if="!isBlockBool">
      <button class="btn" @click="openChannelModal(user.userName)"> Invite {{ $route.params.userName }} in Channel </button>
      <dialog id="modalChannel" class="modal modal-bottom sm:modal-middle" :open="modalChannel">
        <div class="modal-box w-11/12 max-w-5xl">
          <form class ="dialogModalChannel" method="dialog" @submit.prevent="createChannelInDB(channelName, user.userName, $route.params.userName)">
            <input type="text" placeholder="Channel's name" v-model="channelName" class="input input-bordered input-sm w-full max-w-xs" /><br><br>
            <button class="btn">Send Invitation</button>
          </form>
        </div>
      </dialog>
    </div>
    <div class="stat">
      <button class="btn btn-error" v-if="user && !isBlockBool" @click="blockFromDB(user.userName, $route.params.userName)">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        Block {{ $route.params.userName }}
      </button>
      <button class="btn" v-else="user && isBlockBool" @click="unblockFromDB(user.userName, $route.params.userName)">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        Unblock {{ $route.params.userName }}
      </button>
    </div>
  </div>
  <!-- Chat-->
  <div class="chat-box" style="text-align: center" v-if="!isBlockBool">
    <div class="chat-messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <div class="message-row">
          <div v-if="message.receiver.userId === user.userId">
            <div class="chat chat-start">
              <label tabindex="0" class="btn btn-ghost btn-circle">
                <div class="avatar">
                  <div class="w-15 mask mask-squircle">
                    <img :src="actualUser.image" />
                  </div>
                </div>
              </label>
              <div class="chat-bubble" v-if="message.privateMessageText">{{ message.privateMessageText }}</div>
            </div>
          </div>
          <div v-else>
            <div class="chat chat-end">
              <div class="chat-bubble">{{ message.privateMessageText }}</div>
              <label tabindex="0" class="btn btn-ghost btn-circle">
                <div class="avatar">
                  <div class="w-15 mask mask-squircle">
                    <img :src="user.image" />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="chat-input"> -->
      <!-- {{ isUserMuteInChannelInDB() }} -->
      <div style="position: absolute; bottom: 15vh; left: 50%; transform: translateX(-50%);">
        <input  type="text" class="input input-bordered w-full max-w-xs" id="message_text" placeholder="Send Message" v-model="message_text"/>
        <button class="btn btn-primary" @click="createPrivateMessageInDB(user.userName, $route.params.userName, message_text)">Send</button>
      </div>
      <!-- <input v-else type="text" class="input input-bordered w-full max-w-xs" placeholder="You are muted" disabled/> -->
    </div>
<!-- </div> -->
  <!--Alerts-->
  <Alert
    :addChannelSuccess="addChannelSuccess"
    :addChannelFailed="addChannelFailed"
    :addFriendSuccess="addFriendSuccess"
    :addFriendFailed="addFriendFailed"
    :blockSuccess="blockSuccess"
    :blockFailed="blockFailed"
    :removeFriendSuccess="removeFriendSuccess"
    :removeFriendFailed="removeFriendFailed"
    :unblockSuccess="unblockSuccess"
    :unblockFailed="unblockFailed"  
  />
</template>

<style>
  .chat-messages {
    max-height: 55vh;
    overflow-x: auto;
  }
  .chat-messages::-webkit-scrollbar-thumb { background: #888; }
  .chat-messages::-webkit-scrollbar-thumb:hover { background: #555; }
  .chat-messages::-webkit-scrollbar-track { background: #ddd; }

  .stats{
  border-radius: unset;
  }
  .addingFriend {
    text-align: center;
  }

  .dialogModalChannel { 
    text-align:center;
  }
  .rounded-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
  }

  .rounded-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
</style>
