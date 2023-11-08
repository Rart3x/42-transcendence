<script setup>
  import Cookies from "js-cookie";
  import { onMounted, ref } from "vue";
  import { removeChannel, removeFriend } from "./api/delete.call";
  import { getAllChannels, getAllFriends, getUserByCookie } from "./api/get.call";
  import { addFriend, createChannel, setPassword, unsetPassword } from './api/post.call';

  let adminImage = ref(null);
  let currentUserName = ref(null);

  let channelName = ref("");
  const friendName = ref("");
  const userName = ref("");

  const modalChannel = ref(false);
  const modalManageChannel = ref(false);
  const modalMessage = ref(false);

  let channels = ref([]);
  let friends = ref([]);
  let user = ref(null);

  let addChannelSuccess = ref(false);
  let addFriendSuccess = ref(false);
  let removeChannelSuccess = ref(false);
  let removeFriendSuccess = ref(false);

  let addChannelFailed = ref(false);
  let addFriendFailed = ref(false);
  let removeChannelFailed = ref(false);
  let removeFriendFailed = ref(false);

  let passwordCheckBox = false;
  let password = ref("");

  const addFriendFromDB = async (userName, friendName) => {
    const response = await addFriend(userName, friendName);

    if (response && response.success) {
      addFriendSuccess.value = true;
      setTimeout(() => {
        addFriendSuccess.value = false;
      }, 3000);
    } else {
      addFriendFailed.value = true;
      setTimeout(() => {
        addFriendFailed.value = false;
      }, 3000);
    }
    friends.value = await getAllFriends(userName);
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
    channels.value = await getAllChannels(userName);
  };

  const togglePasswordInput = async (channelName, password, passwordCheckBox) => {
    if (passwordCheckBox)
      setPassword(channelName, password);
    else
      unsetPassword(channelName, password);
    modalManageChannel.value = false;
  };

  const setPasswordInDB = async (password) => { setPassword(password); };
  const unsetPasswordInDB = async (password) => { unsetPassword(password); };

  const removeFriendFromDB = async (userName, friendName) => {
    const response = await removeFriend(userName, friendName);
    
    if (response && response.success) {
      removeFriendSuccess.value = true;
      setTimeout(() => {
        removeFriendSuccess.value = false;
      }, 3000);
    } else {
      removeFriendFailed.value = true;
      setTimeout(() => {
        removeFriendFailed.value = false;
      }, 3000);
    }
    friends.value = await getAllFriends(userName);
  };

  const removeChannelFromDB = async (channelName) => {
    const response = await removeChannel(channelName);
    
    if (response && response.success) {
      removeChannelSuccess.value = true;
      setTimeout(() => {
        removeChannelSuccess.value = false;
      }, 3000);
    } else {
      removeChannelFailed.value = true;
      setTimeout(() => {
        removeChannelFailed.value = false;
      }, 3000);
    }
    channels.value = await getAllChannels(userName);
  };

  const openChannelModal = (userName) => {
    modalChannel.value = true;
    currentUserName = userName;
  };

  const openManageChannelModal = () => { modalManageChannel.value = true; };
  const openMessageModal = () => { modalMessage.value = true; };

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));
    
    if (!user.value)
      window.location.href = "/";

    userName.value = user.value.displayName;
    adminImage = "src/assets/userImages/" + user.value.image;

    let friendsData = await getAllFriends(user.value.userName);
    friendsData.forEach(async (friend, index) => {
      let imagePath = "../assets/userImages/" + friend.image;
      await import(/* @vite-ignore */ imagePath).then((image) => {
        friendsData[index].imageSrc = image.default;
      });
    });

    friends.value.splice(0, friends.value.length, ...friendsData);
    channels.value.splice(0, channels.value.length, ...(await getAllChannels(user.value.userName)));
  });
</script>

<template>
  <!--Stats-->
  <div class="stats shadow">
    <!--Username-->
    <div class="stat">
      <div class="stat-figure text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </div>
      <div class="stat-title">Username</div>
      <div class="stat-value">{{ userName }}</div>
    </div>
    <!--Games total-->
    <div class="stat">
      <div class="stat-figure text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </div>
      <div class="stat-title">Games Total</div>
      <div class="stat-value">0</div>
    </div>
    <!--Games won-->
    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div class="stat-title">Games won</div>
      <div class="stat-value">0</div>
    </div>
    <!--Username-->
    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div class="stat-title">Winrate</div>
      <div class="stat-value">0%</div>
    </div>
  </div>
 <body>
  <div class="overflow-x-auto">
    <div class="grid-container">
      <div class="underStat">
        <form @submit.prevent="addFriendFromDB(userName, friendName)">
          <button class="btn btn-primary">Add Friend</button>
          <input type="text" id="friendName" v-model="friendName" class="input input-bordered w-full max-w-xs" />
        </form>
      </div>
      <br>
      <!--FriendList-->
      <div class="requestTable table-border">
        <table class="table">
          <caption>Friends</caption>
          <tbody>
            <tr v-for="(user, index) in friends" :key="index">
              <td>
                <label tabindex="0" class="btn btn-ghost btn-circle">
                  <div class="avatar">
                    <div class="w-20 mask mask-squircle">
                      <img :src="user.imageSrc" />
                    </div>
                  </div>
                </label>
              </td>
              <td>
                <router-link :to="'/profile/' + user.userName">
                  <button class="btn no-animation">{{ user.userName }}</button>
                </router-link>
              </td>
              <td>
                <button class="btn btn-error" @click="removeFriendFromDB(userName, user.userName)">Delete Friend</button>
              </td>
              <td> <button class="btn">Invite in a Game</button> </td>
              <td>
                <button class="btn" @click="openChannelModal(user.userName)">Invite in Channel</button>
                <dialog id="modalChannel" class="modal modal-bottom sm:modal-middle" :open="modalChannel">
                  <div class="modal-box w-11/12 max-w-5xl">
                    <form class ="dialogModalChannel" method="dialog" @submit.prevent="createChannelInDB(channelName, userName, currentUserName)">
                      <input type="text" placeholder="Channel's name" v-model="channelName" class="input input-bordered input-sm w-full max-w-xs" /><br><br>
                      <button class="btn">Send Invitation</button>
                    </form>
                  </div>
                </dialog>
              </td>
              <td>
                <button class="btn" @click="openMessageModal(user.userName)">Send Message</button>
                <dialog id="modalMessage" class="modal modal-bottom sm:modal-middle" :open="modalMessage">
                  <div class="modal-box w-11/12 max-w-5xl">
                    <form class ="dialogModalMessage" method="dialog" @submit.prevent="createMessageInDB(MessageName, userName, currentUserName)">
                      <button class="btn">BITE</button>
                    </form>
                  </div>
                </dialog>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <br>
      <!--ChannelList-->
      <div class="requestTable table-border">
        <table class="table">
          <caption>Channels</caption>
          <tbody>
            <tr v-for="(channel, index) in channels" :key="index">
              <td>
                <label tabindex="0" class="btn btn-ghost btn-circle">
                  <div class="avatar">
                    <div class="w-20 mask mask-squircle">
                      <img :src="adminImage" />
                    </div>
                  </div>
                </label>
              </td>
              <td>
                <router-link :to="'/channel/' + channel.channelName">
                  <button class="btn no-animation">{{ channel.channelName }}</button>
                </router-link>
              </td>
              <td>
                <!-- <div v-if="user.isChecked" class="profile"> -->
                  <button class="btn btn-error" @click="removeChannelFromDB(channel.channelName)">Delete Channel</button>
                <!-- </div>
                <div v-else class="profile">
                  <button class="btn" @click="sendMessageFromFront">Visit Profile</button>
                </div> -->
              </td>
              <td>
                <button class="btn" @click="openManageChannelModal(user.userName)">Manage Channel</button>
                <dialog id="modalManageChannel" class="modal modal-bottom sm:modal-middle" :open="modalManageChannel">
                  <div class="modal-box w-11/12 max-w-5xl">
                    <form class="dialogModalChannel" @submit.prevent="togglePasswordInput(channel.channelName, password, passwordCheckBox)">
                      <label>Set password</label><br><br>
                      <input type="checkbox" class="checkbox" v-model="passwordCheckBox"><br><br>
                      <input v-if="passwordCheckBox.value" type="text" placeholder="Password" v-model="password" class="input input-bordered input-sm w-full max-w-xs" />
                      <button class="btn" >Apply changes</button>
                    </form>
                  </div>
                </dialog>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!--Alerts-->
  <div v-if="addFriendSuccess" class="toast toast-start">
    <div class="alert alert-success">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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

  <div v-if="removeChannelSuccess" class="toast toast-start">
    <div class="alert alert-success">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Channel deleted successfully.</span>
    </div>
  </div>
  <div v-if="removeChannelFailed" class="toast toast-start">
    <div class="alert alert-error">
      <span>Failed to delete Channel</span>
    </div>
  </div>
  </body>
</template>

<style>
.stats{
  border-radius: unset;
}
  body{
    min-height: 82.2vh;
  }

  .requestTable {
    max-height: 34vh;
    overflow-x: auto;
  }

  .requestTable::-webkit-scrollbar {
    width: 10px;
  }

  .requestTable::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  .requestTable::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .requestTable::-webkit-scrollbar-track {
    background: #ddd;
  }

  .dialogModalChannel { 
    text-align:center;
  }

  .underStat {
    display: center;
    text-align: center;
  }
</style>