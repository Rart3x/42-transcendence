<script setup>
  import Alert from './Alert.vue';
  import Cookies from "js-cookie";
  import History from "./History.vue";
  import UserStatHeader from "./UserStatHeader.vue";
  import { ref, onMounted } from 'vue';
  import { removeFriend } from './api/delete.call';
  import { isBlock, isFriend, getPrivateMessages, getUserByUserId, getUserByUserName, isBlocked } from './api/get.call';
  import { blockUser, createChannel, unblockUser } from './api/post.call';
  import { useRoute } from 'vue-router';
  import { useStore } from 'vuex';

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
  let iAmBlocked = ref(false);

  const route = useRoute();

  const channelName = ref(null);
  const modalChannel = ref(false);
  let currentUserName = null;
  
  let messages = ref([]);
  let message_text = ref(null);

  let cookieJWT = ref(null);
  let store = useStore();

  const addFriendFromDB = async (userName, friendName) => {
    const friend = await getUserByUserName(friendName, cookieJWT.value);
    if (friend.status == 'online')
      await store.dispatch('friendRequest', {host: userName ,socket: friend.socket })
  };

  const blockFromDB = async (userName, blockedUserName) => {
    const response = await blockUser(userName, blockedUserName, cookieJWT.value);
    const removedUser = await getUserByUserName(blockedUserName, cookieJWT.value);

    if (response && response.success) {
      isBlockBool.value = true;
      blockSuccess.value = true;
      if (removedUser.status == 'online') { 
        await store.dispatch('friendRemoved', { socket: removedUser.socket })
        await store.dispatch('blockUser', { socket: removedUser.socket, userName: userName})  
        await store.dispatch('updateDM', { socket: user.value.socket, userName: blockedUserName})
      }
      setTimeout(() => {
        blockSuccess.value = false;
      }, 3000);
      if (isFriendBool.value)
        await removeFriendFromDB(userName, blockedUserName, cookieJWT.value);
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
    const response = await createChannel(channelName, userName, currentUserName, cookieJWT.value);
    modalChannel.value = false;

    if (response && response.success) {
      const invitedUser = await getUserByUserName(currentUserName, cookieJWT.value);
      if (invitedUser.status == 'online')
        store.dispatch("newChannelSuggestion", { socket : invitedUser.socket });
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

  const isBlockFromDB = async (userName, blockedUserName) => {
    const response = await isBlock(userName, blockedUserName, cookieJWT.value);

    if (response && response.success)
      isBlockBool.value = true;
    else
      isBlockBool.value = false;
  };

  const isBlockedFromDB = async (userName, blockedUserName) => {
    const response = await isBlocked(userName, blockedUserName, cookieJWT.value);

    if (response && response.success)
      iAmBlocked.value = true;
    else
      iAmBlocked.value = false;
  };

  const isFriendFromDB = async (userName, friendName) => {
    const response = await isFriend(userName, friendName, cookieJWT.value);

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
    const response = await removeFriend(userName, friendName, cookieJWT.value);
    const removedUser = await getUserByUserName(friendName, cookieJWT.value);
    
    if (response && response.success) {
      removeFriendSuccess.value = true;
      if (removedUser.status == 'online')
        await store.dispatch('friendRemoved', { socket: removedUser.socket })
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

  const socketOn = async () => {
    store.state.socket.on('blocked', async () => {
      isBlockBool.value = true;
      iAmBlocked.value = true;
      if (isFriendBool.value)
        await removeFriendFromDB(user.value.userName, actualUser.value.userName, cookieJWT.value);
    })

    store.state.socket.on('friendAdded', async () => {
      isFriendBool.value = true;
    });

    store.state.socket.on('friendRemoved', async () => {
      isFriendBool.value = false;
    });

    store.state.socket.on('unblocked', async () => {
      isBlockBool.value = false;
      iAmBlocked.value = false;
    })

  }

  onMounted(async () => {
    let cookieUserId = Cookies.get('UserId');
		cookieJWT.value = Cookies.get('Bearer');

    if (typeof cookieUserId !== 'undefined' && typeof cookieJWT.value !== 'undefined')
      user.value = await getUserByUserId(cookieUserId, cookieJWT.value);
    actualUser.value = await getUserByUserName(route.params.userName, cookieJWT.value);

    await isFriendFromDB(user.value.userName, actualUser.value.userName, cookieJWT.value);
    await isBlockFromDB(user.value.userName, actualUser.value.userName, cookieJWT.value);
    await isBlockedFromDB(user.value.userName, actualUser.value.userName, cookieJWT.value);

    messages.value = await getPrivateMessages(user.value.userName, actualUser.value.userName, cookieJWT.value);
    socketOn();
  });

  const unblockFromDB = async (userName, unblockedUserName) => {
    const response = await unblockUser(userName, unblockedUserName, cookieJWT.value);
    const unblockedUser = await getUserByUserName(unblockedUserName, cookieJWT.value);

    if (response && response.success) {
      unblockSuccess.value = true;
      if (unblockedUser.status == 'online')
        await store.dispatch('unblockUser', { socket: unblockedUser.socket })
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
    :userName="$route.params.userName"
    :gamePlayed="user.gamePlayed"
    :gameWon="user.gameWon"
  />

  <div class="bg-base-200 overflow-x-auto min-h-[calc(100vh-210px)] font-mono place-items-center shadow">
    <div class="stats shadow flex justify-center">
      <div class="stat" v-if="user && actualUser && user.userName != actualUser.userName && !isBlockBool">
        <button class="btn" v-if="user && !isFriendBool" @click="addFriendFromDB(user.userName, $route.params.userName)">
          Add {{ $route.params.userName }}
        </button>
        <button class="btn btn-error" v-else="user && isFriendFromDB(user.userName, $route.params.userName)" @click="removeFriendFromDB(user.userName, $route.params.userName)">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          Remove {{ $route.params.userName }}
        </button>
      </div>
      <div v-if="user && actualUser && user.userName != actualUser.userName && !isBlockBool" class="stat">
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
      <div v-if="user && actualUser && user.userName != actualUser.userName" class="stat">
        <button class="btn btn-error" v-if="user && !isBlockBool" @click="blockFromDB(user.userName, $route.params.userName)">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          Block {{ $route.params.userName }}
        </button>
        <button class="btn" v-else-if="user && isBlockBool && !iAmBlocked" @click="unblockFromDB(user.userName, $route.params.userName)">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          Unblock {{ $route.params.userName }}
        </button>
      </div>
    </div> 
    <History :key="$route.params.userName" :userName="$route.params.userName" :visitedProfile="true"/>
  </div>
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
  .addingFriend { text-align: center; }
  .dialogModalChannel {  text-align:center; }
  .chat-messages { max-height: 55vh; overflow-x: auto; }
  .chat-messages::-webkit-scrollbar-thumb { background: #888; }
  .chat-messages::-webkit-scrollbar-thumb:hover { background: #555; }
  .chat-messages::-webkit-scrollbar-track { background: #ddd; }
  .rounded-image { width: 150px; height: 150px; border-radius: 50%; overflow: hidden; }
  .rounded-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .stats { border-radius: unset; }
</style>
