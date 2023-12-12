<script>
  import Alert from "./Alert.vue";
  import Cookies from "js-cookie";
  import History from "./History.vue";
  import Modal from "./Modal.vue";
  import UserStatHeader from "./UserStatHeader.vue";
  import { getAllChannels, getAllNewChannels, getAllChannelsFromUser, getAllFriends, getUserByCookie, getUserByUserName, getGameRoomByRoomId, getPrivateMessages, } from "./api/get.call";
  import { addFriend, createChannel, joinChannel, setClientSocket, createGameRoom, setPassword, unsetPassword } from "./api/post.call";
  import { removeFriend } from "./api/delete.call";
  import { sha256 } from "js-sha256";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";

  export const inviteFriendInGameEXPORT = async function (userName, userId, userSocket, userStatus, user) {
    const host = user.userName;
    var gameRoom = await createGameRoom(host);
    if (gameRoom) 
      await store.dispatch('invitationInGame', { host, userName, userId, userSocket, userStatus });
  }

  export const socketOnEXPORT = function() {
    socketOn();
  }

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
        currentUserName: "", channelName: "", friendName: "", hostName: "", newChannelName: "", senderName: "", userName: "",
        modalStates: { modalChannel: false, modalManageChannel: false, }, modalMessage: false,
        allChannels: null, channels: [], currentUser: null, friends: [], hostGame: null, privateMessages: [], user: null,
        addChannelSuccess: false, addFriendSuccess: false, addMessageSuccess: false, invitationInGameSuccess: false, inviteInGameSuccess: false, joinChannelSuccess: false, removeChannelSuccess: false, removeFriendSuccess: false, setPassSuccess: false, unsetPassSuccess: false, 
        addChannelFailed: false, addFriendFailed: false, addMessageFailed: false, inviteInGameFailed: false, joinChannelFailed: false, removeChannelFailed: false, removeFriendFailed: false, setPassFailed: false, unsetPassFailed: false,
        message_text: "", password: "", friendsData: [], 
        router: useRouter(), store: useStore(),
        activeTab: "friends",
      };
    },
    methods: {
      async addFriendFromDB(userName, friendName) {
        const response = await addFriend(userName, friendName);

        if (response && response.success) {
          this.addFriendSuccess = true;
          setTimeout(() => {
            this.addFriendSuccess = false;
          }, 3000);
        } else {
          this.addFriendFailed = true;
          setTimeout(() => {
            this.addFriendFailed = false;
          }, 3000);
        }
        this.updateFriends();
      },

      async createChannelInDB(channelName, userName, currentUserName) {
        const response = await createChannel(channelName, userName, currentUserName);
        this.modalStates.modalChannel = false;

        if (response && response.success) {
          this.addChannelSuccess = true;
          setTimeout(() => {
            this.addChannelSuccess = false;
          }, 3000);
        } else {
          this.addChannelFailed = true;
          setTimeout(() => {
            this.addChannelFailed = false;
          }, 3000);
        }
        this.updateChannels();
      },
  
      async inviteFriendInGame (userName, userId, userSocket, userStatus) {
        const hostPlayer = await getUserByUserName(this.user.userName);
        const invitedPlayer = await getUserByUserName(userName);
        var gameRoom = await createGameRoom(hostPlayer.userName, invitedPlayer.userName);
        if (gameRoom){
          await this.store.dispatch('invitationInGame', { hostPlayer,  gameRoom, userName, userId, userSocket, userStatus });
        }
      },

      async joinChannelInDB(channelName, userName) {
        const response = await joinChannel(channelName, userName);

        if (response && response.success) {
          this.joinChannelSuccess = true;
          setTimeout(() => {
            this.joinChannelSuccess = false;
          }, 3000);
        } else {
          this.joinChannelFailed = true;
          setTimeout(() => {
            this.joinChannelFailed = false;
          }, 3000);
        }
        this.updateChannels();
        this.updateAllChannels();
      },

      async removeChannelFromDB(channelName) {
        const response = await removeChannel(channelName);
    
        if (response && response.success) {
          this.removeChannelSuccess = true;
          setTimeout(() => {
            this.removeChannelSuccess = false;
          }, 3000);
        } else {
          this.removeChannelFailed = true;
          setTimeout(() => {
            removeChannelFailed = false;
          }, 3000);
        }
        this.updateChannels();
      },

      async removeFriendFromDB(userName, friendName) {
        const response = await removeFriend(userName, friendName);
        
        if (response && response.success) {
          this.removeFriendSuccess = true;
          setTimeout(() => {
            this.removeFriendSuccess = false;
          }, 3000);
        } else {
          this.removeFriendFailed = true;
          setTimeout(() => {
            this.removeFriendFailed = false;
          }, 3000);
        }
        this.updateFriends();
      },

      async togglePasswordInput(channelName, password, check) {
        if (check) {
          const response = await setPassword(channelName, sha256(password));
          if (response) {
            this.setPassSuccess = true;
            setTimeout(() => {
              this.setPassSuccess = false;
            }, 3000);
          } else {
            this.setPassFailed = true;
              setTimeout(() => {
                this.setPassFailed = false;
            }, 3000);
          }
        }
        else
        { 
          const response = unsetPassword(channelName);
          if (response) {
            this.unsetPassSuccess = true;
            setTimeout(() => {
              this.unsetPassSuccess = false;
            }, 3000);
          } else {
            this.unsetPassFailed = true;
              setTimeout(() => {
                this.unsetPassFailed = false;
            }, 3000);
          }
        }
        this.closeModal('modalManageChannel');
      },

      closeModal(modalKey) {
        this.modalStates[modalKey] = false;       
      },
      closeMessageModal() {
        this.modalMessage = false;      
      },
      openChannelModal(userName) {
        this.modalStates.modalChannel = true; this.currentUserName = userName;
      },
      openManageChannelModal(channel) {
        this.channelName = channel; this.modalStates.modalManageChannel = true;      
      },
        
      async socketEmit(emit) {
        const hostUser = await getUserByUserName(this.hostName);
        if (emit === "invitationInGameAccepted" || emit === "invitationInGameDeclined")
          this.invitationInGameSuccess = false;
        this.router.push('/game');
        this.store.state.socket.emit('localGame', { playerId: this.user.userId, hostGameId: this.hostGame.id });
        this.store.state.socket.emit(emit, { userName: hostUser.userName, userSocket: hostUser.socket });
      },

      socketOn() {
        this.store.state.socket.on('invitedInGame', (body) => {
          this.hostGame = body.gameRoom;
          this.hostName = body.host;
          this.invitationInGameSuccess = true;
          setTimeout(() => {
            this.invitationInGameSuccess = false;
          }, 30000);
      });

      this.store.state.socket.on('invitationAccepted', (body) => {
        console.log("host player");
        this.router.push('/game'); 
        this.store.state.socket.emit('localGame', { playerId: this.user.userId, hostGameId: this.hostGame.id });
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

      async updateFriends() {
        this.friendsData = await getAllFriends(this.user.userName);
        for (let i = 0; i < this.friendsData.length; i++) {
          const imagePath = "../assets/userImages/" + this.friendsData[i].image;
          const image = await import(/* @vite-ignore */ imagePath);
          this.friendsData[i].imageSrc = image.default;
        }
        this.friends = this.friendsData;
      },
      async updateChannels() {
        let channelsData = await getAllChannelsFromUser(this.user.userName);
        for (let i = 0; i < channelsData.length; i++) {
          const imagePath = "../assets/userImages/" + channelsData[i].channelAdminImage;
          const image = await import(/* @vite-ignore */ imagePath);
          channelsData[i].imageSrc = image.default;
        }
        this.channels = channelsData;
      },
      async updateAllChannels() {
        let allChannelsData = await getAllNewChannels(this.user.userName);
        for (let i = 0; i < allChannelsData.length; i++) {
          const imagePath = "../assets/userImages/" + allChannelsData[i].channelAdminImage;
          const image = await import(/* @vite-ignore */ imagePath);
          allChannelsData[i].imageSrc = image.default;
        }
        this.allChannels = allChannelsData;
      },
      updateAll() {
        this.updateFriends();
        this.updateChannels();
        this.updateAllChannels();
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

      this.updateAll();

      this.friends.splice(0, this.friends.length, ...this.friendsData);
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
            <form @submit.prevent="createChannelInDB(newChannelName, userName)">
              <button class="btn glass">Create Channel</button>
              <input type="text" id="newChannelName" v-model="newChannelName" class="input input-bordered w-full max-w-xs" />
            </form>
          </div>
          <div class="requestTable table-border">
          <table class="table">
            <tbody>
              <tr v-for="(channel, index) in channels" :key="index" class="dark-row" >
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
                <td>
                  <button v-if="user && channel && channel.channelAdmin == user.userId" class="btn glass btn-error" @click="removeChannelFromDB(channel.channelName)">Delete Channel</button>
                </td>
                <td>
                  <button v-if="user && channel && channel.channelAdmin == user.userId" class="btn glass" @click="openManageChannelModal(channel.channelName)">Manage Channel</button>
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
              <tr v-for="(channel, index) in allChannels" :key="index" class="dark-row">
                <div v-if="!channel.password && !channel.isPrivate" class="channelSecurity">
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
      :setPassSuccess="setPassSuccess"
      :unsetPassSuccess="unsetPassSuccess"

      :addChannelFailed="addChannelFailed"
      :addFriendFailed="addFriendFailed"
      :addMessageFailed="addMessageFailed"
      :inviteInGameFailed="inviteInGameFailed"
      :joinChannelFailed="joinChannelFailed"
      :removeChannelFailed="removeChannelFailed"
      :removeFriendFailed="removeFriendFailed"
      :setPassFailed="setPassFailed"
      :unsetPassFailed="unsetPassFailed"

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
      :togglePasswordInput="togglePasswordInput"
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