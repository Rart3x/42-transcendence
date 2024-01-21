<script>
  import Alert from "./Alert.vue";
  import Cookies from "js-cookie";
  import History from "./History.vue";
  import Modal from "./Modal.vue";
  import UserStatHeader from "./UserStatHeader.vue";
  import { getAllChannels, getAllNewChannels, getAllChannelsFromUser, getAllUsers, getUsersFromChannel, getUserByUserId, getAllFriends, getUserByUserName, getGameRoomByRoomId, getPrivateMessages, getImage, getChannelByName } from "./api/get.call";
  import { createChannel, joinChannel, setClientSocket, createGameRoom, setPassword, unsetPassword, createEmptyChannel } from "./api/post.call";
  import { removeChannel, removeFriend } from "./api/delete.call";
  import { sha256 } from "js-sha256";
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
        currentUserName: "", channelName: "", friendName: "", newChannelName: "", senderName: "", userName: "",
        modalStates: { modalChannel: false, modalManageChannel: false, }, modalMessage: false,
        allChannels: null, channels: [], currentUser: null, friends: [], privateMessages: [], user: null,
        addChannelSuccess: false, addFriendSuccess: false, addMessageSuccess: false, invitationInGameSuccess: false, inviteInGameSuccess: false, joinChannelSuccess: false, removeChannelSuccess: false, removeFriendSuccess: false, setPassSuccess: false, unsetPassSuccess: false, 
        addChannelFailed: false, addFriendFailed: false, addMessageFailed: false, inviteInGameFailed: false, joinChannelFailed: false, removeChannelFailed: false, removeFriendFailed: false, setPassFailed: false, unsetPassFailed: false,
        message_text: "", password: "", friendsData: [], 
        router: useRouter(), store: useStore(), cookieJWT: null,
        activeTab: "friends",
      };
    },
    methods: {
      async addFriendFromDB(userName, friendName) {
        const friend = await getUserByUserName(friendName, this.cookieJWT);
        console.log(friend.status);
        if (friend && friend.status === 'online' && friendName !== userName)
          await this.store.dispatch('friendRequest', {host: userName ,socket: friend.socket })
        else
          { 
            this.addFriendFailed = true;
            setTimeout(() => {
              this.addFriendFailed = false;
            }, 3000);
          }
        this.friendName = ''
      },

      async createChannelInDB(channelName, userName, currentUserName) {
        let response;
  
        const currentChan = await getChannelByName(channelName, this.cookieJWT);

        if (!currentUserName) { 
          if (currentChan) {
            this.addChannelFailed = true;
            setTimeout(() => {
              this.addChannelFailed = false;
            }, 3000);
            return;
          }
          response = await createEmptyChannel(channelName, userName, this.cookieJWT);
        }
        else {
          response = await createChannel(channelName, userName, currentUserName, this.cookieJWT);
        }
        
        this.modalStates.modalChannel = false;
        if (response && response.success) {
          const allUsers = await getAllUsers(this.cookieJWT);

          for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].status === 'online')
              await this.store.dispatch('newChannelSuggestion', { socket: allUsers[i].socket });
          }
          this.addChannelSuccess = true;
          setTimeout(() => {
            this.addChannelSuccess = false;
          }, 3000);
          this.updateChannels();
        } else {
          this.addChannelFailed = true;
          setTimeout(() => {
            this.addChannelFailed = false;
          }, 3000);
        }
        this.newChannelName = '';
      },
  
      async inviteFriendInGame (userName, userId, userSocket, userStatus) {
        const hostPlayer = await getUserByUserName(this.user.userName, this.cookieJWT);
        const invitedPlayer = await getUserByUserName(userName, this.cookieJWT);
        const host = hostPlayer.userName;
        const socket = invitedPlayer.socket;
        var gameRoom = await createGameRoom(hostPlayer.userName, invitedPlayer.userName, this.cookieJWT);
        if (gameRoom && invitedPlayer.status === 'online')
          await this.store.dispatch('invitationInGame', { host, gameRoom, userName, userId, socket, userStatus });
      },

      async joinChannelInDB(channelName, userName) {
        const response = await joinChannel(channelName, userName, this.cookieJWT);
        const channelUsers = await getUsersFromChannel(channelName, this.cookieJWT);

        if (response && response.success) {
          this.joinChannelSuccess = true;
          for (let i = 0; i < channelUsers.length; i++) {
            if (channelUsers[i].status === 'online')
              await this.store.dispatch('newChannelMember', { socket: channelUsers[i].socket })
          }
          setTimeout(() => {
            this.joinChannelSuccess = false;
          }, 3000);
          this.updateChannels();
          this.updateAllChannels();
        } else {
          this.joinChannelFailed = true;
          setTimeout(() => {
            this.joinChannelFailed = false;
          }, 3000);
        }
      },

      async removeChannelFromDB(channelName) {
        const usersFromChannel = await getUsersFromChannel(channelName, this.cookieJWT);
        const response = await removeChannel(channelName, this.cookieJWT);
    
        if (response && response.success) {
          for (let i = 0; i < usersFromChannel.length; i++) {
            if (usersFromChannel[i].status === 'online')
              await this.store.dispatch('removeChannel', { socket: usersFromChannel[i].socket })
          }
          this.removeChannelSuccess = true;
          setTimeout(() => {
            this.removeChannelSuccess = false;
          }, 3000);
          this.updateChannels();
        } else {
          this.removeChannelFailed = true;
          setTimeout(() => {
            removeChannelFailed = false;
          }, 3000);
        }
      },

      async removeFriendFromDB(userName, friendName) {
        const response = await removeFriend(userName, friendName, this.cookieJWT);
        
        if (response && response.success) {
          this.removeFriendSuccess = true;
          setTimeout(() => {
            this.removeFriendSuccess = false;
          }, 3000);
          const removedUser = await getUserByUserName(friendName, this.cookieJWT);
          if (removedUser.status === 'online')
            await this.store.dispatch('friendRemoved', { socket: removedUser.socket })
          this.updateFriends();
        } else {
          this.removeFriendFailed = true;
          setTimeout(() => {
            this.removeFriendFailed = false;
          }, 3000);
        }
      },

      async togglePasswordInput(channelName, password, check) {
        if (check) {
          const response = await setPassword(channelName, sha256(password), this.cookieJWT);
          if (response) {
            this.setPassSuccess = true;
            const channelUsers = await getUsersFromChannel(channelName, this.cookieJWT);
            for (let i = 0; i < channelUsers.length; i++) {
              if (channelUsers[i].status === 'online')
                await this.store.dispatch('newChannelPass', { socket: channelUsers[i].socket })
            }
            this.updateChannels();
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
          const response = unsetPassword(channelName, this.cookieJWT);
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

      socketOn() {
        this.store.state.socket.on('banned' , () => {
          this.updateAllChannels();
          this.updateChannels();
        })
        this.store.state.socket.on('channelPrivate', () => {
          this.updateAllChannels();
          this.updateChannels();
        })
        this.store.state.socket.on('kicked', () => {
          this.updateAllChannels();
          this.updateChannels();
        })
        this.store.state.socket.on('friendRemoved', () => {
          this.updateFriends();
        })
        this.store.state.socket.on('friendAdded', async () => {
          this.updateFriends();
        });
        this.store.state.socket.on('newChannelPass', () => {
          this.updateChannels();
        });
        this.store.state.socket.on('newChannelSuggestion', () => {
          this.updateAllChannels();
          this.updateChannels();
        })
        this.store.state.socket.on('removeChannel', () => {
          this.updateAllChannels();
          this.updateChannels();
        });
      },

      showContent(tab) { this.activeTab = tab; },

      async updateFriends() {
        this.friendsData = await getAllFriends(this.user.userName, this.cookieJWT);
        for (let i = 0; i < this.friendsData.length; i++) {
          this.friendsData[i].imageSrc = await getImage(this.friendsData[i].image);
        }
        this.friends = this.friendsData;
      },
      async updateChannels() {
        let channelsData = await getAllChannelsFromUser(this.user.userName, this.cookieJWT);
        for (let i = 0; i < channelsData.length; i++) {
          channelsData[i].imageSrc = await getImage(channelsData[i].channelAdminImage);
        }
        this.channels = channelsData;
      },
      async updateAllChannels() {
        let allChannelsData = await getAllNewChannels(this.user.userName, this.cookieJWT);
        for (let i = 0; i < allChannelsData.length; i++) {
          allChannelsData[i].imageSrc = await getImage(allChannelsData[i].channelAdminImage)
            let channelUsersBan = allChannelsData[i].channelUsersBan;
            let isUserBanned = channelUsersBan.some(user => user.userId === this.user.userId);

            if (isUserBanned)
              allChannelsData[i].isBanned = true;
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
      let cookieUserId = Cookies.get('UserId');
		  this.cookieJWT  = Cookies.get('Bearer');

      if (typeof cookieUserId !== 'undefined' && typeof this.cookieJWT !== 'undefined')
        this.user = await getUserByUserId(cookieUserId, this.cookieJWT);
      if (this.user){
        await new Promise((resolve) => {
          const interval = setInterval(() => {
            if (this.store.state.socket) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
        await setClientSocket(this.user.userName, this.store.state.socket.id, this.cookieJWT);

        if (this.store && this.store.state.socket)
          this.socketOn();

        this.userName = this.user.userName;
        this.adminImage = this.user.image;

        this.updateAll();

        this.friends.splice(0, this.friends.length, ...this.friendsData);
      }
    }
  };
</script>

<template>
  <UserStatHeader v-if="user"
    :userName="userName"
    :gamePlayed="user.gamePlayed"
    :gameWon="user.gameWon"
  />
  <div class="bg-base-200 min-h-[calc(100vh-210px)] overflow-x-auto font-mono place-items-center">
    <div class="buttons">
      <button class="btn glass" @click="showContent('friends')">Friends</button>
      <button class="btn glass" @click="showContent('channels')">Channels</button>
      <button class="btn glass" @click="showContent('suggestions')">Suggestions</button>
      <button class="btn glass" @click="showContent('history')">Game History</button>
    </div>
    <div>
      <!--FriendList-->
      <div v-if="activeTab === 'friends'" class="p-4">
        <div class="underStat">
          <form name="addFriendFromDB" @submit.prevent="addFriendFromDB(userName, friendName)">
            <button class="btn glass">Add Friend</button>
            <input type="text" id="friendName" v-model="friendName" class="input input-bordered w-full max-w-xs" />
          </form>
        </div>
      <div v-if="friends.length > 0" class="requestTable table-border">
        <table class="table">
          <tbody>
            <tr class="dark-row" v-for="(user, index) in friends" :key="index">
              <td>
                <span tabindex="0" class="btn btn-ghost btn-circle">
                  <div class="avatar">
                    <div class="w-15 mask mask-squircle">
                      <img :src="user.imageSrc" />
                    </div>
                  </div>
                </span>
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
      <div v-else class="error_div"> <p> You have no friends! </p> </div>
      </div>
      <!--ChannelList-->
      <div v-if="activeTab === 'channels'" class="p-4">
        <div class="underStat">
          <form name="createChannelInDB" @submit.prevent="createChannelInDB(newChannelName, userName)">
            <button class="btn glass">Create Channel</button>
            <input type="text" id="newChannelName" v-model="newChannelName" class="input input-bordered w-full max-w-xs" maxlength="" />
          </form>
        </div>
      <div v-if="channels.length > 0" class="requestTable table-border">
        <table class="table">
          <tbody>
            <tr v-for="(channel, index) in channels" :key="index" class="dark-row" >
              <td>
                <span tabindex="0" class="btn glass btn-ghost btn-circle">
                  <div class="avatar">
                    <div class="w-15 mask mask-squircle">
                      <img :src="channel.imageSrc" />
                    </div>
                  </div>
                </span>
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
      <div v-else class="error_div"> <p> You have no channels! </p>
      </div>
      </div>
      <!--Suggestions-->
      <div v-if="activeTab === 'suggestions' && allChannels.length > 0" class="p-4">
        <table class="table">
          <tbody>
            <tr v-for="(channel, index) in allChannels" :key="index" class="dark-row">
              <div v-if="!channel.password && !channel.isPrivate && !channel.isBanned" class="channelSecurity">
                <td>
                  <span tabindex="0" class="btn glass btn-ghost btn-circle">
                    <div class="avatar">
                      <div class="w-15 mask mask-squircle">
                        <img :src="channel.imageSrc" />
                      </div>
                    </div>
                  </span>
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
      <div v-else-if="activeTab === 'suggestions' && allChannels.length == 0" class="error_div"> <p> There are no suggestions for you! </p> </div>
      <div v-if="activeTab === 'history'" class="p-4">
        <History :userName="user.userName" :visitedProfile="false"/>
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
</template>

<style>
  body { min-height: 82.2vh; }
  .buttons { text-align: center; }
	.content { flex-grow: 1; min-height: 70vh; max-height: 70vh;}
  .dark-row:hover { background-color: #364e6e; }
  .dialogModal { text-align:center; }
  .error_div { color: white; display: flex; justify-content: center; align-items: center; height: 50vh; font-family: monospace; }
  .error_div p::before {content: "😢 ";}
  .error_div p::after {content: " 😢";}
  .underStat { display: center; text-align: center; }
  .stats { border-radius: unset; }
  .requestTable { overflow-x: auto; }
  .requestTable::-webkit-scrollbar { width: 10px; }
  .requestTable::-webkit-scrollbar-thumb { background: #888; border-radius: 5px; }
  .requestTable::-webkit-scrollbar-thumb:hover {  background: #555; }
  .requestTable::-webkit-scrollbar-track { background: #ddd; }
</style>