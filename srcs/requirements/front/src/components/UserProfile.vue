<script>
  import Alert from "./Alert.vue";
  import Cookies from "js-cookie";
  import History from "./History.vue";
  import Modal from "./Modal.vue";
  import UserStatHeader from "./UserStatHeader.vue";
  import { getAllChannels, getAllNewChannels, getAllChannelsFromUser, getAllFriends, getUserByCookie, getUserByUserName, getGameRoomByRoomId, getPrivateMessages, } from "./api/get.call";
  import { addFriend, createChannel, joinChannel, setClientSocket } from "./api/post.call";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";

  export default {
    name: "UserProfile",
    components: {
      Alert,
      History,
      Modal,
      UserStatHeader,
    },
    data() {
      return {
        adminImage: null,
        currentUserName: "", channelName: "", friendName: "", hostName: "", senderName: "", userName: "",
        modalStates: { modalChannel: false, modalManageChannel: false, }, modalMessage: false,
        allChannels: null, channels: [], currentUser: null, friends: [], privateMessages: [], user: null,
        addChannelSuccess: false, addFriendSuccess: false, addMessageSuccess: false, invitationInGameSuccess: false, inviteInGameSuccess: false, joinChannelSuccess: false, removeChannelSuccess: false, removeFriendSuccess: false,
        addChannelFailed: false, addFriendFailed: false, addMessageFailed: false, inviteInGameFailed: false, joinChannelFailed: false, removeChannelFailed: false, removeFriendFailed: false,
        message_text: "", password: "",
        router: useRouter(), store: useStore(),
        activeTab: "friends",
      };
    },
    methods: {
      async addFriendFromDB(userName, friendName) {
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
      },

      async createChannelInDB(channelName, userName, currentUserName) {
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
      },
  
      async inviteFriendInGame (userName, userId, userSocket, userStatus) {
        const host = this.user.userName;
        await this.store.dispatch('invitationInGame', { host, userName, userId, userSocket, userStatus });
      },

      async joinChannelInDB(channelName, userName) {
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
      },

      async removeChannelFromDB(channelName) {
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
        channels.value = await getAllChannelsFromUser(userName);
      },

      async removeFriendFromDB(userName, friendName) {
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
      },

      closeModal(modalKey) {
        modalStates[modalKey].value = false;       
      },
      closeMessageModal() {
        modalMessage.value = false;      
      },
      openChannelModal(userName) {
        modalStates.modalChannel.value = true; currentUserName.value = userName;
      },
      openManageChannelModal(channel) {
        channelName.value = channel; modalStates.modalManageChannel.value = true;      
      },
        
      async socketEmit(emit) {
        const hostUser = await getUserByUserName(this.hostName);
        if (emit === "invitationInGameAccepted" || emit === "invitationInGameDeclined")
          this.invitationInGameSuccess = false;
        this.router.push('/game');
        this.store.state.socket.emit('localGame', this.user.userId);
        this.store.state.socket.emit(emit, { userName: hostUser.userName, userSocket: hostUser.socket });
      },
  
      socketOn() {
        this.store.state.socket.on('invitedInGame', (body) => {
        this.hostName = body.host;
        this.invitationInGameSuccess = true;
        setTimeout(() => {
          this.invitationInGameSuccess = false;
        }, 30000);
      });

      this.store.state.socket.on('invitationAccepted', (body) => {
        this.router.push('/game');
        this.store.state.socket.emit('localGame', this.user.userId);
      });

      this.store.state.socket.on('invitationDeclined', (body) => {
        this.hostName = body.host;
        this.inviteInGameFailed = true;
        setTimeout(() => {
          this.inviteInGameFailed = false;
        }, 5000);
        });
      },

      showContent(tab) {
        this.activeTab = tab;
      },
    },

    async mounted() {
      this.user = await getUserByCookie(Cookies.get("_authToken"));

      this.store.dispatch('initializeSocket');
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (this.store.state.socket) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
      setClientSocket(this.user.userName, this.store.state.socket.id);

      if (this.store && this.store.state.socket)
        this.socketOn();

      this.userName = this.user.displayName;
      this.adminImage = "src/assets/userImages/" + this.user.image;

      let friendsData = await getAllFriends(this.user.userName);
      this.channels = await getAllChannelsFromUser(this.user.userName);
      this.allChannels = await getAllNewChannels(this.user.userName);

      for (let i = 0; i < friendsData.length; i++) {
        const imagePath = "../assets/userImages/" + friendsData[i].image;
        const image = await import(/* @vite-ignore */ imagePath);
        friendsData[i].imageSrc = image.default;
      }

      for (let i = 0; i < this.channels.length; i++) {
        const imagePath = "../assets/userImages/" + this.channels[i].channelAdminImage;
        const image = await import(/* @vite-ignore */ imagePath);
        this.channels[i].imageSrc = image.default;
      }

      for (let i = 0; i < this.allChannels.length; i++) {
        const imagePath = "../assets/userImages/" + this.allChannels[i].channelAdminImage;
        const image = await import(/* @vite-ignore */ imagePath);
        this.allChannels[i].imageSrc = image.default;
      }

      this.friends.splice(0, this.friends.length, ...friendsData);
    },
  };
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