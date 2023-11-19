<script setup>
  import Alert from "./Alert.vue";
  import Cookies from "js-cookie";
	import sha256 from 'js-sha256';
  import { onMounted, ref } from "vue";
  import { removeChannel, removeFriend } from "./api/delete.call";
  import { getAllChannels, getAllFriends, getUserByCookie, getGameRoomByRoomId } from "./api/get.call";
  import { addFriend, createChannel, createEmptyChannel, createPrivateMessage, setPassword, setStatus, unsetPassword } from './api/post.call';

  let adminImage = ref(null);
  let currentUserName = ref(null);

  let channelName = ref("");
  const friendName = ref("");
  const userName = ref("");

  const modalStates = { modalMessage: ref(false), modalChannel: ref(false), modalManageChannel: ref(false) };

  let channels = ref([]);
  let friends = ref([]);
  let user = ref(null);

  let addChannelSuccess = ref(false);
  let addFriendSuccess = ref(false);
  let addMessageSuccess = ref(false);
  let removeChannelSuccess = ref(false);
  let removeFriendSuccess = ref(false);

  let addChannelFailed = ref(false);
  let addFriendFailed = ref(false);
  let addMessageFailed = ref(false);
  let removeChannelFailed = ref(false);
  let removeFriendFailed = ref(false);

  let message_text = ref("");
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

  const createEmptyChannelInDB = async (channelName, userName) => {
    const response = await createEmptyChannel(channelName, userName);
    modalStates.modalChannel.value = false;

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

  const createChannelInDB = async (channelName, userName, currentUserName) => {
    const response = await createChannel(channelName, userName, currentUserName);
    modalStates.modalChannel.value = false;

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

  const createPrivateMessageInDB = async (userName, currentUserName, message_text) => {
    const response = await createPrivateMessage(userName, currentUserName, message_text);
    modalStates.modalMessage.value = false;

    if (response && response.success) {
      addMessageSuccess.value = true;
      setTimeout(() => {
        addMessageSuccess.value = false;
      }, 3000);
    } else {
      addMessageFailed.value = true;
      setTimeout(() => {
        addMessageFailed.value = false;
      }, 3000);
    }
  };

  const togglePasswordInput = async (channelName, password, passwordCheckBox) => {
    if (passwordCheckBox)
      setPassword(channelName, sha256(password));
    else
      unsetPassword(channelName, sha256(password));
    modalManageChannel.value = false;
  };

  const removeFriendFromDB = async (userName, friendName) => {
    const response = await removeFriend(userName, friendName);
    
    if (response && response.success) {
      removeFriendSuccess.value = true;
      setTimeout(() => {
        removeFriendSuccess.value = false;
      }, 3000);
    } 
    else {
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
    } 
    else {
      removeChannelFailed.value = true;
      setTimeout(() => {
        removeChannelFailed.value = false;
      }, 3000);
    }
    channels.value = await getAllChannels(userName);
  };

  const closeModal = (modalKey) => { modalStates[modalKey].value = false; };

  const openChannelModal = (userName) => {
    modalStates.modalChannel.value = true;
    currentUserName = userName;
  };

  const openManageChannelModal = () => { modalStates.modalManageChannel.value = true; };
  const openMessageModal = () => { modalStates.modalMessage.value = true; };

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));
    
    if (!user.value) window.location.href = "/";

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

  let activeTab = ref('friends');

  const showContent = (tab) => { activeTab.value = tab; };

</script>

<template>
  <div class="stats shadow">
    <div class="stat">
      <div class="stat-figure text-primary">
      </div>
      <div class="stat-title">Username</div>
      <div class="stat-value">{{ userName }}</div>
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

    <div class="stat">
      <div class="stat-figure text-secondary">
      </div>
      <div class="stat-title">Winrate</div>
      <div class="stat-value">0%</div>
    </div>
  </div>
  <body>
    <div class="overflow-x-auto">
      <div class="buttons">
        <button class="btn" @click="showContent('friends')">Friends</button>
        <button class="btn" @click="showContent('channels')">Channels</button>
        <button class="btn" @click="showContent('suggestions')">Suggestions</button>
      </div>
      <div class="content">
        <!--FriendList-->
        <div v-if="activeTab === 'friends'" class="p-4">
          <div class="underStat">
            <form @submit.prevent="addFriendFromDB(userName, friendName)">
              <button class="btn">Add Friend</button>
              <input type="text" id="friendName" v-model="friendName" class="input input-bordered w-full max-w-xs" />
            </form>
          </div>
        <div class="requestTable table-border">
          <table class="table">
            <caption>Friends</caption>
            <tbody>
              <tr class="dark-row" v-for="(user, index) in friends" :key="index">
                <td>
                  <label tabindex="0" class="btn btn-ghost btn-circle">
                    <div class="avatar">
                      <div class="w-15 mask mask-squircle">
                        <img :src="user.imageSrc" />
                      </div>
                    </div>
                  </label>
                </td>
                <td>
                  <router-link :to="'/profile/' + user.userName">
                    <button v-if="user.status === 'offline'" class="btn no-animation text-red-500">{{ user.userName }}</button>
                    <button v-if="user.status === 'online'" class="btn no-animation text-green-500">{{ user.userName }}</button>
                    <button v-if="user.status === 'ingame'" class="btn no-animation text-blue-500">{{ user.userName }}</button>
                  </router-link>
                </td>
                <td>
                  <button class="btn btn-error" @click="removeFriendFromDB(userName, user.userName)">Delete Friend</button>
                </td>
                <td> <button class="btn">Invite in a Game</button> </td>
                <td>
                  <button class="btn" @click="openChannelModal(user.userName)">Invite in Channel</button>
                  <dialog id="modalChannel" class="modal modal-bottom sm:modal-middle" :open="modalStates.modalChannel.value" @keydown.esc="closeModal('modalChannel')">
                    <div class="modal-box w-11/12 max-w-5xl">
                      <form class ="dialogModal" method="dialog" @submit.prevent="createChannelInDB(channelName, userName, currentUserName)">
                        <input type="text" placeholder="Channel's name" v-model="channelName" class="input input-bordered input-sm w-full max-w-xs" /><br><br>
                        <button class="btn">Send Invitation</button>
                      </form>
                    </div>
                  </dialog>
                </td>
                <td>
                  <button class="btn" @click="openMessageModal(user.userName)">Send Message</button>
                  <dialog id="modalMessage" class="modal modal-bottom sm:modal-middle" :open="modalStates.modalMessage.value" @keydown.esc="closeModal('modalMessage')">
                    <div class="modal-box w-11/12 max-w-5xl">
                      <form class ="dialogModal" method="dialog" @submit.prevent="createPrivateMessageInDB(userName, user.userName, message_text)">
                        <input type="text" v-model="message_text" class="input input-bordered input-sm w-full max-w-xs" /><br><br>
                      </form>
                    </div>
                  </dialog>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
        <!--ChannelList-->
        <div v-if="activeTab === 'channels'" class="p-4">
          <div class="underStat">
            <form @submit.prevent="createEmptyChannelInDB(channelName, userName)">
              <button class="btn">Create Channel</button>
              <input type="text" id="channelName" v-model="channelName" class="input input-bordered w-full max-w-xs" />
            </form>
          </div>
          <div class="requestTable table-border">
          <table class="table">
            <caption>Channels</caption>
            <tbody>
              <tr class="dark-row" v-for="(channel, index) in channels" :key="index">
                <td>
                  <label tabindex="0" class="btn btn-ghost btn-circle">
                    <div class="avatar">
                      <div class="w-15 mask mask-squircle">
                        <img :src="adminImage" />
                      </div>
                    </div>
                  </label>
                </td>
                <td v-if="!channel.password">
                  <router-link :to="'/channel/' + channel.channelName">
                    <button class="btn no-animation">{{ channel.channelName }}</button>
                  </router-link>
                </td>
                <td v-else>
                  <router-link :to="'/checkPass/' + channel.channelName">
                    <button class="btn no-animation">{{ channel.channelName }}</button>
                  </router-link>
                </td>
                <td v-if="user && channel && channel.channelAdmin.userId == user.userId">
                  <button class="btn btn-error" @click="removeChannelFromDB(channel.channelName)">Delete Channel</button>
                </td>
                <td v-if="user && channel && channel.channelAdmin == user.userId">
                  <button class="btn" @click="openManageChannelModal(user.userName)">Manage Channel</button>
                  <dialog id="modalManageChannel" class="modal modal-bottom sm:modal-middle" :open="modalStates.modalManageChannel.value" @keydown.esc="closeModal('modalManageChannel')">
                    <div class="modal-box w-11/12 max-w-5xl">
                      <form class="dialogModal" @submit.prevent="togglePasswordInput(channel.channelName, password, passwordCheckBox)">
                        <label>Set password</label><br><br>
                        <input type="checkbox" class="checkbox" v-model="passwordCheckBox"><br><br>
                        <input type="text" placeholder="Password" v-model="password" class="input input-bordered input-sm w-full max-w-xs" />
                        <br>
                        <button class="btn">Apply changes</button>
                      </form>
                    </div>
                  </dialog>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
        <!--Suggestions-->
        <div v-if="activeTab === 'suggestions'" class="p-4">
          Contenu C
        </div>
      </div>
    </div>
    <!--Alerts-->
    <Alert
      :addChannelSuccess="addChannelSuccess"
      :addFriendSuccess="addFriendSuccess"
      :addMessageSuccess="addMessageSuccess"
      :removeChannelSuccess="removeChannelSuccess"
      :removeFriendSuccess="removeFriendSuccess"
      :addChannelFailed="addChannelFailed"
      :addFriendFailed="addFriendFailed"
      :addMessageFailed="addMessageFailed"
      :removeChannelFailed="removeChannelFailed"
      :removeFriendFailed="removeFriendFailed"
    />
  </body>
</template>

<style>
  body { min-height: 82.2vh; }
  .buttons { text-align: center; }
  .dark-row:hover { background-color: #364e6e; }
  .stats { border-radius: unset; }


  .requestTable {
    max-height: 34vh;
    overflow-x: auto;
  }
  .requestTable::-webkit-scrollbar { width: 10px; }
  .requestTable::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }
  .requestTable::-webkit-scrollbar-thumb:hover {  background: #555; }
  .requestTable::-webkit-scrollbar-track { background: #ddd; }

  .dialogModal { text-align:center; }

  .underStat {
    display: center;
    text-align: center;
  }
</style>