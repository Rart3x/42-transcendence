<script setup>
  import Alert from "./Alert.vue";
  import Modal from "./Modal.vue";
  import UserStatHeader from "./UserStatHeader.vue";
  import History from "./History.vue";
  import Cookies from "js-cookie";
  import { onMounted, ref } from "vue";
  import { removeChannel, removeFriend } from "./api/delete.call";
  import { getAllChannels, getAllNewChannels, getAllChannelsFromUser, getAllFriends, getUserByCookie, getUserByUserName, getGameRoomByRoomId, getPrivateMessages } from "./api/get.call";
  import { addFriend, createChannel, joinChannel, setClientSocket } from './api/post.call';
  import { io } from 'socket.io-client';
  import { useRouter } from "vue-router";

  let adminImage = ref(null);
  
  let currentUserName = ref("");
  let channelName = ref("");
  const friendName = ref("");
  let hostName = ref("");
  let senderName = ref("");
  const userName = ref("");

  const modalStates = { modalChannel: ref(false), modalManageChannel: ref(false) };
  const modalMessage = ref(false);

  let allChannels;
  let channels = ref([]);
  let currentUser = ref(null);
  let friends = ref([]);
  let privateMessages = ref([]);
  let user = ref(null);

  let socket = ref(null);

  let addChannelSuccess = ref(false);
  let addFriendSuccess = ref(false);
  let addMessageSuccess = ref(false);
  let invitationInGameSuccess = ref(false);
  let inviteInGameSuccess = ref(false);
  let joinChannelSuccess = ref(false);
  let removeChannelSuccess = ref(false);
  let removeFriendSuccess = ref(false);

  let addChannelFailed = ref(false);
  let addFriendFailed = ref(false);
  let addMessageFailed = ref(false);
  let invitationInGameFailed = ref(false);
  let inviteInGameFailed = ref(false);
  let joinChannelFailed = ref(false);
  let removeChannelFailed = ref(false);
  let removeFriendFailed = ref(false);

  let message_text = ref("");
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
    channels.value = await getAllChannelsFromUser(userName);
  };

  const joinChannelInDB = async (channelName, userName) => {
    const response = await joinChannel(channelName, userName);

    if (response && response.success) {
      joinChannelSuccess.value = true;
      setTimeout(() => {
        joinChannelSuccess.value = false;
      }, 3000);
    } else {
      joinChannelFailed.value = true;
      setTimeout(() => {
        joinChannelFailed.value = false;
      }, 3000);
    }
    channels.value = await getAllChannelsFromUser(userName);
    allChannels = await getAllNewChannels(userName);
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
    channels.value = await getAllChannelsFromUser(userName);
  };

  const inviteFriendInGame = (userName, userId, userSocket, userStatus) => {
    // router.push('/game');
    const host = user.value.userName;
    socket.value.emit('invitationInGame', { host, userName, userId, userSocket, userStatus });
    // socket.value.emit('localGame', user.value.userId);
  
    // let sock = "90f2aeee274984a13f92cc00420126c9ac2153c11c938a0a18dfe87d0bea2391";
    // socket.value.emit('invitationInGame', { userName, sock, userStatus });

    // socket.value.on('invitationInGameSuccess', () => {
    //   inviteInGameSuccess = true;
    //   setTimeout(() => {
    //     inviteInGameSuccess = false;
    //   }, 30000);
    // });

    // socket.value.on('invitationInGameFailed', () => {
    //   inviteInGameFailed = true;
    //   setTimeout(() => {
    //     inviteInGameFailed = false;
    //   }, 3000);
    // });
  }

  const closeModal = (modalKey) => { modalStates[modalKey].value = false; };
  const closeMessageModal = () => { modalMessage.value = false; };
  const openChannelModal = (userName) => { modalStates.modalChannel.value = true; currentUserName.value = userName; };
  const openManageChannelModal = (channel) => { channelName.value = channel; modalStates.modalManageChannel.value = true; };

  var router;

  const socketEmit = async (emit) => {
    const hostUser = await getUserByUserName(hostName.value);
    if (emit === "invitationInGameAccepted" || emit === "invitationInGameDeclined")
      invitationInGameSuccess.value = false;
    socket.value.emit(emit, { userName: hostUser.userName, userId: hostUser.userId, userSocket: hostUser.socket });
  }

  const socketOn = () => {

    socket.value.on('invitedInGame', (data) => {
      hostName.value = data.host;
      invitationInGameSuccess.value = true;
      setTimeout(() => {
        invitationInGameSuccess.value = false;
      }, 30000);
    });

    socket.value.once('invitationInGameAccepted', (data) => {
      console.log("accepteed");
      hostName = data.host;
      inviteInGameSuccess.value = true;
      setTimeout(() => {
        inviteInGameSuccess.value = false;
      }, 30000);
    });

    // socket.value.on('invitationInGameDeclined', (data) => {
    //   console.log("declined");
    //   hostName = data.host;
    //   inviteInGameFailed.value = true;
    //   setTimeout(() => {
    //     inviteInGameFailed.value = false;
    //   }, 30000);
    // });
  };
  
  onMounted(async () => {
    router = useRouter();

    socket.value = io('http://localhost:3000');
  
    user.value = await getUserByCookie(Cookies.get("_authToken"));
    setClientSocket(user.value.userName, socket.value.id);

    socketOn();

    userName.value = user.value.displayName;
    adminImage = "src/assets/userImages/" + user.value.image;

    let friendsData = await getAllFriends(user.value.userName);
    channels = await getAllChannelsFromUser(user.value.userName);
    allChannels = await getAllNewChannels(user.value.userName);

    for (let i = 0; i < friendsData.length; i++) {
      const imagePath = "../assets/userImages/" + friendsData[i].image;
      const image = await import(/* @vite-ignore */ imagePath);
      friendsData[i].imageSrc = image.default;
    }

    for (let i = 0; i < channels.length; i++) {
      const imagePath = "../assets/userImages/" + channels[i].channelAdminImage;
      const image = await import(/* @vite-ignore */ imagePath);
      channels[i].imageSrc = image.default;
    }

    for (let i = 0; i < allChannels.length; i++) {
      const imagePath = "../assets/userImages/" + allChannels[i].channelAdminImage;
      const image = await import(/* @vite-ignore */ imagePath);
      allChannels[i].imageSrc = image.default;
    }

    friends.value.splice(0, friends.value.length, ...friendsData);
  });

  let activeTab = ref('friends');

  const showContent = (tab) => { activeTab.value = tab; };

</script>

<template>
  <body>
    <UserStatHeader v-if="user"
      :userName="userName"
      :gamePlayed="user.gamePlayed"
      :gameWon="user.gameWon"
    />
    <div class="overflow-x-auto min-h-screen bg-base-200 font-mono">
      <div class="buttons">
        <button class="btn glass" @click="showContent('friends')">Friends</button>
        <button class="btn glass" @click="showContent('channels')">Channels</button>
        <button class="btn glass" @click="showContent('suggestions')">Suggestions</button>
        <button class="btn glass" @click="showContent('history')">Game History</button>
      </div>
      <div class="content">
        <!--FriendList-->
        <div v-if="activeTab === 'friends'" class="p-4">
          <div class="underStat">
            <form @submit.prevent="addFriendFromDB(userName, friendName)">
              <button class="btn glass">Add Friend</button>
              <input type="text" id="friendName" v-model="friendName" class="input input-bordered w-full max-w-xs" />
            </form>
          </div>
        <div class="requestTable table-border">
          <table class="table">
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
                    <button v-if="user.status === 'offline'" class="btn glass no-animation text-red-500">{{ user.userName }}</button>
                    <button v-if="user.status === 'online'" class="btn glass no-animation text-green-500">{{ user.userName }}</button>
                    <button v-if="user.status === 'ingame'" class="btn glass no-animation text-blue-500">{{ user.userName }}</button>
                  </router-link>
                </td>
                <td> <button class="btn btn-error" @click="removeFriendFromDB(userName, user.userName)">Delete Friend</button> </td>
                <td> <button class="btn glass" @click="inviteFriendInGame(user.userName, user.userId, user.socket, user.status)">Invite in a Game</button> </td>
                <td>
                  <button class="btn glass" @click="openChannelModal(user.userName)">Invite in Channel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
        <!--ChannelList-->
        <div v-if="activeTab === 'channels'" class="p-4">
          <div class="underStat">
            <form @submit.prevent="createChannelInDB(channelName, userName)">
              <button class="btn glass">Create Channel</button>
              <input type="text" id="channelName" v-model="channelName" class="input input-bordered w-full max-w-xs" />
            </form>
          </div>
          <div class="requestTable table-border">
          <table class="table">
            <tbody>
              <tr class="dark-row" v-for="(channel, index) in channels" :key="index">
                <td>
                  <label tabindex="0" class="btn glass btn-ghost btn-circle">
                    <div class="avatar">
                      <div class="w-15 mask mask-squircle">
                        <img :src="channel.imageSrc" />
                      </div>
                    </div>
                  </label>
                </td>
                <td v-if="!channel.channelPassword">
                  <router-link :to="'/channel/' + channel.channelName">
                    <button class="btn glass no-animation">{{ channel.channelName }}</button>
                  </router-link>
                </td>
                <td v-else>
                  <router-link :to="'/checkPass/' + channel.channelName">
                    <button class="btn glass no-animation">{{ channel.channelName }}</button>
                  </router-link>
                </td>
                <td v-if="user && channel && channel.channelAdmin.userId == user.userId">
                  <button class="btn glass btn-error" @click="removeChannelFromDB(channel.channelName)">Delete Channel</button>
                </td>
                <td v-if="user && channel && channel.channelAdmin == user.userId">
                  <button class="btn glass" @click="openManageChannelModal(channel.channelName)">Manage Channel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
        <!--Suggestions-->
        <div v-if="activeTab === 'suggestions'" class="p-4">
          <table class="table">
            <tbody>
              <tr class="dark-row" v-for="(channel, index) in allChannels" :key="index">
                <div class="channelSecurity" v-if="!channel.password && !channel.isPrivate">
                  <td>
                    <label tabindex="0" class="btn glass btn-ghost btn-circle">
                      <div class="avatar">
                        <div class="w-15 mask mask-squircle">
                          <img :src="channel.imageSrc" />
                        </div>
                      </div>
                    </label>
                  </td>
                  <td>
                    <router-link :to="'/channel/' + channel.channelName">
                      <button class="btn glass no-animation">{{ channel.channelName }}</button>
                    </router-link>
                  </td>
                  <td>
                    <button class="btn glass" @click="joinChannelInDB(channel.channelName, userName)">Join Channel</button>
                  </td>
                </div>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="activeTab === 'history'" class="p-4">
          <History :userName="user.userName"/>
        </div>
      </div>
    </div>
    <!--Alerts-->
    <Alert
      :addChannelSuccess="addChannelSuccess"
      :addFriendSuccess="addFriendSuccess"
      :addMessageSuccess="addMessageSuccess"
      :invitationInGameSuccess="invitationInGameSuccess"
      :inviteInGameSuccess="inviteInGameSuccess"
      :joinChannelSuccess="joinChannelSuccess"
      :removeChannelSuccess="removeChannelSuccess"
      :removeFriendSuccess="removeFriendSuccess"

      :addChannelFailed="addChannelFailed"
      :addFriendFailed="addFriendFailed"
      :addMessageFailed="addMessageFailed"
      :invitationInGameFailed="invitationInGameFailed"
      :inviteInGameFailed="inviteInGameFailed"
      :joinChannelFailed="joinChannelFailed"
      :removeChannelFailed="removeChannelFailed"
      :removeFriendFailed="removeFriendFailed"

      :hostName="hostName"

      :socketEmit="socketEmit"
    />
    <!--Modals-->
    <Modal
      :currentUserName="currentUserName"
      :currentChannelName="channelName"
      :friendName="friendName"
      :senderName="senderName"
      :userName="userName"

      :modalStates="modalStates"
      :modalMessage="modalMessage"
  
      :parent="'userProfile'"
  
      :user="user"

      :addFriendFromDB="addFriendFromDB"
      :closeModal="closeModal"
      :closeMessageModal="closeMessageModal"
      :createChannelInDB="createChannelInDB"
      :joinChannelInDB="joinChannelInDB"
      :removeFriendFromDB="removeFriendFromDB"
    />
  </body>
</template>

<style>
  body { min-height: 82.2vh; }
  .buttons { text-align: center; }
  .dark-row:hover { background-color: #364e6e; }
  .dialogModal { text-align:center; }
  .underStat { display: center; text-align: center; }

  .requestTable { overflow-x: auto; }
  .requestTable::-webkit-scrollbar { width: 10px; }
  .requestTable::-webkit-scrollbar-thumb { background: #888; border-radius: 5px; }
  .requestTable::-webkit-scrollbar-thumb:hover {  background: #555; }
  .requestTable::-webkit-scrollbar-track { background: #ddd; }
</style>