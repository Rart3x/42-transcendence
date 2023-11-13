<script setup>
  import Cookies from "js-cookie";
  import { ref, onMounted } from 'vue';
  import { removeFriend } from './api/delete.call';
  import { isFriend, getUserByCookie, getUserByName } from './api/get.call';
  import { addFriend, createChannel } from './api/post.call';
  import { useRoute } from 'vue-router';

  let actualUser = ref(null);
  let user = ref(null);

  let addChannelSuccess = ref(false);
  let addFriendSuccess = ref(false);
  let removeFriendSuccess = ref(false);

  let addChannelFailed = ref(false);
  let addFriendFailed = ref(false);
  let removeFriendFailed = ref(false);

  let isFriendBool = ref(false);

  const route = useRoute();

  const channelName = ref(null);
  let   currentUserName = null;
  const modalChannel = ref(false);
  const userName = ref(null);

  const addFriendFromDB = async (userName, friendName) => {
    const response = await addFriend(userName, friendName);

    if (response && response.success) {
      addFriendSuccess.value = true;
      setTimeout(() => {
        addFriendSuccess.value = false;
      }, 3000);
      isFriendBool.value = true;
    } else {
      addFriendFailed.value = true;
      setTimeout(() => {
        addFriendFailed.value = false;
      }, 3000);
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
    } else {
      addChannelFailed.value = true;
      setTimeout(() => {
        addChannelFailed.value = false;
      }, 3000);
    }
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
    } else {
      removeFriendFailed.value = true;
      setTimeout(() => {
        removeFriendFailed.value = false;
      }, 3000);
    }
  };

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));
    actualUser.value = await getUserByName(route.params.userName);
    isFriendBool.value = isFriendFromDB(user.value.userName, actualUser.value.userName).sucess;

    let imagePath = "../assets/userImages/" + actualUser.value.image;
    await import(/* @vite-ignore */ imagePath).then((image) => {
      actualUser.value.image = image.default;
    });
  });
</script> 

<template>
  <!--Stats-->
  <div class="stats shadow">
    <div class="stat">
      <div class="stat-figure text-primary">
      </div>
      <div class="stat-title">Username</div>
      <div class="stat-value">{{ $route.params.userName }}</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-primary">
      </div>
      <div class="stat-title">Games Total</div>
      <div class="stat-value">0</div>
    </div>
    
    <div class="stat">
      <div class="stat-figure text-secondary">
      </div>
      <div class="stat-title">Games won</div>
      <div class="stat-value">0</div>
    </div>
  </div>
  <div class="stats shadow">
    <div class="stat">
      <button class="btn" v-if="user && !isFriendBool" @click="addFriendFromDB(user.userName, $route.params.userName)">
        Add {{ $route.params.userName }}
      </button>
      <button class="btn btn-error" v-else="user && isFriendFromDB(user.userName, $route.params.userName)" @click="removeFriendFromDB(user.userName, $route.params.userName)">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        Remove {{ $route.params.userName }}
      </button>
    </div>
    <div class="stat">
      <button class="btn" v-if="user && !isFriendBool" @click="openChannelModal(user.userName)"> Invite {{ $route.params.userName }} in Channel </button>
      <dialog id="modalChannel" class="modal modal-bottom sm:modal-middle" :open="modalChannel">
        <div class="modal-box w-11/12 max-w-5xl">
          <form class ="dialogModalChannel" method="dialog" @keyup="esc" @submit.prevent="createChannelInDB(channelName, user.userName, $route.params.userName)">
            <input type="text" placeholder="Channel's name" v-model="channelName" class="input input-bordered input-sm w-full max-w-xs" /><br><br>
            <button class="btn">Send Invitation</button>
          </form>
        </div>
      </dialog>
    </div>
  </div>
  <!--Alerts-->
  <div v-if="addFriendSuccess" class="toast toast-start">
    <div class="alert alert-success">
      <span>Friend added successfully.</span>
    </div>
  </div>
  <div v-if="addFriendFailed" class="toast toast-start">
    <div class="alert alert-error">
      <span>Failed to add friend.</span>
    </div>
  </div>

  <div v-if="removeFriendSuccess" class="toast toast-start">
    <div class="alert alert-success">
      <span>Friend deleted successfully.</span>
    </div>
  </div>
  <div v-if="removeFriendFailed" class="toast toast-start">
    <div class="alert alert-error">
      <span>Failed to delete Friend</span>
    </div>
  </div>

  <div v-if="addChannelSuccess" class="toast toast-start">
    <div class="alert alert-success">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Channel created successfully.</span>
    </div>
  </div>
  <div v-if="addChannelFailed" class="toast toast-start">
    <div class="alert alert-error">
      <span>Failed to create Channel</span>
    </div>
  </div>
  
</template>

<style>
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
