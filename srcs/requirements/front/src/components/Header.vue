<script>
  import Alert from "./Alert.vue";
  import Cookies from "js-cookie";
  import Drawer from "./Drawer.vue";
  import Modal from "./Modal.vue";
  import { getAllUsers, getPrivateMessagesByUserName, getUserByUserId, getUserByUserName, getImage } from "./api/get.call.ts";
  import { addFriend, createGameRoom, createPrivateMessage, setStatus, setClientSocket, setA2FInvalid } from "./api/post.call.ts";
  import { deleteGameRoomById, deletePrivateMessages } from "./api/delete.call.ts";
  import { RouterLink } from "vue-router";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";

  export default {
    name: 'Header',
    components: {
      Alert,
      Drawer,
      Modal,
    },
    data() {
      return {
        hostGame: null, 
        imageSrc: null,
        modalMessage: false,
        privateMessages: [],
        searchInput: "",
  
        user: null,
        users: [],

        channelNameBanned: "",
        channelNameKicked: "",
        channelNameMuted: "",
        currentUserName: "",
        messageSenderName: "",
        hostName: "",
        senderName: "",
        userName: "",

        invitationFriendSuccess: false,

        friendRequestAccepted: false,
        friendRequestDeclined: false,

        bannedSuccess: false,
        invitationInGameSuccess: false,
        inviteInGameSuccess: false,
        inviteInGameFailed: false,
        kickedSuccess: false,
        messageSuccess: false,
        mutedSuccess: false,

        userDoesntExist: false,
        modalIsOpen: false,

        cookieJWT: null,
        store: useStore(),
        router: useRouter(),
      };
    },
    computed: {
      filteredUsers() {
        if (this.searchInput.length < 3)
          return [];
        if (!this.users || !this.searchInput)
          return this.users;

        try {
          const searchInputValue = this.searchInput.trim();
          const regex = new RegExp(`^${searchInputValue}`, 'i');

          return this.users.filter(user =>
            (user.userName && regex.test(user.userName))
          );
        } catch (error) {
          return [];
        }
      }
    },
    methods: {
      async createPrivateMessageInDB(userName, senderName, message_text) {
        const user1 = await getUserByUserName(senderName, this.cookieJWT);
        if (!user1) {
          this.modalMessage = false;
          this.userDoesntExist = true;
          setTimeout(() => {
            this.userDoesntExist = false;
          }, 5000); 
          return ;
        }
        const socket = user1.socket;
        if (message_text === "/game" && userName !== senderName) { 
          message_text = "";
          this.modalMessage = false;
          var gameRoom = await createGameRoom(userName, user1.userName, this.cookieJWT);
          if (gameRoom && user1.status === "online")
            await this.store.dispatch('invitationInGame', { host:userName, gameRoom, userName:user1.userName, userId:user1.userId, socket:user1.socket, userStatus:user1.status });
        }
        else {
          await createPrivateMessage(userName, senderName, message_text, this.cookieJWT);
          if (user1.status === "online")
            await this.store.dispatch('sendPrivateMessage', { senderName, socket, userName } );
          this.privateMessages = await getPrivateMessagesByUserName(this.user.userName, this.cookieJWT);
        }
      },
      async logout() {
        Cookies.remove("UserId");
        Cookies.remove("Bearer");
        if (this.user){
          this.user = await getUserByUserId(this.user.userId, this.cookieJWT);
          if (this.user.A2F)
            await setA2FInvalid(this.user.userName, this.cookieJWT);
          await setStatus(this.user.userName, "offline", this.cookieJWT);
        }
        window.location.href = "/";
      },
      async resetSearchBar(name) {
        const test = await getUserByUserName(name, this.cookieJWT);

        this.searchInput = '';
        window.location.href = "/profile/" + name;
      },
      async socketEmit(emit) {
        const hostUser = await getUserByUserName(this.hostName, this.cookieJWT);
        if (emit == "invitationInGameAccepted" || emit == "invitationInGameDeclined")
          this.invitationInGameSuccess = false;
        if (emit == "invitationInGameAccepted"){
          this.store.commit('SET_INVITED', true);
          this.router.push('/game');
          this.store.state.socket.emit('localGame', { playerId: this.user.userId, hostGameId: this.hostGame.id })
        }
        if (emit == "friendRequestAccepted" || emit == "friendRequestDeclined")
          this.invitationFriendSuccess = false;
        if (emit == "friendRequestAccepted") {
          await this.store.dispatch('friendAdded', { sock: this.user.socket })
          this.store.state.socket.emit(emit, { host: hostUser.userName, socket: hostUser.socket, invitedUserName: this.user.userName });
        }
        else if (emit == "friendRequestDeclined")
          this.store.state.socket.emit(emit, { host: hostUser.userName, socket: hostUser.socket, invitedUserName: this.user.userName });
        else if (emit == "invitationInGameAccepted")
          this.store.state.socket.emit(emit, { host: hostUser.userName, socket: hostUser.socket, hostGameId: this.hostGame.id });
        else if (emit == "invitationInGameDeclined")
          this.store.state.socket.emit(emit, { host: hostUser.userName, socket: hostUser.socket, hostGameId: this.hostGame.id });
        else
          this.store.state.socket.emit(emit, { host: hostUser.userName, socket: hostUser.socket, invitedUserName: this.user.userName });
      },

      async socketOn() {
        if (this.user){
          setStatus(this.user.userName, "online", this.cookieJWT);
        }

        this.store.state.socket.on('blocked', async (body) => {
          await deletePrivateMessages(body.userName, this.user.userName, this.cookieJWT);
          this.invitationFriendSuccess = false;
          this.privateMessages = await getPrivateMessagesByUserName(this.user.userName, this.cookieJWT);
        })

        this.store.state.socket.on('banned', (body) => {
          this.channelNameBanned = body.channelName;
          this.bannedSuccess = true;
          setTimeout(() => {
            this.bannedSuccess = false;
          }, 5000);
        });

        this.store.state.socket.on('friendRequest', (body) => {
          this.hostName = body.host;
          this.invitationFriendSuccess = true;
          setTimeout(() => {
            this.invitationFriendSuccess = false;
          }, 5000);
        });

        this.store.state.socket.on('friendRequestAccepted', async (body) => {
          this.friendRequestAccepted = true;
          await addFriend(this.user.userName, body.invitedUserName, this.cookieJWT)
          const invitedUser = await getUserByUserName(body.invitedUserName, this.cookieJWT);
          const hostUser = await getUserByUserName(body.host, this.cookieJWT);
          if (invitedUser.status === "online")
            await this.store.dispatch('friendAdded', { socket: invitedUser.socket });
          if (hostUser.status === "online")
            await this.store.dispatch('friendAdded', { socket: hostUser.socket });
          setTimeout(() => {
            this.friendRequestAccepted = false;
          }, 3000);
        });

        this.store.state.socket.on('friendRequestDeclined', (body) => {
          this.friendRequestDeclined = true;
          setTimeout(() => {
            this.friendRequestDeclined = false;
          }, 3000);
        });

        this.store.state.socket.on('invitationInGame', (body) => {
          this.hostGame = body.gameRoom;
          this.hostName = body.host;
          this.invitationInGameSuccess = true;
          setTimeout(() => {
            this.invitationInGameSuccess = false;
          }, 30000);
        });

        this.store.state.socket.on('invitationInGameAccepted', (body) => {
          this.hostName = body.host;
          this.store.commit('SET_INVITED', true);
          this.router.push('/game');
          this.store.state.socket.emit('localGame', { playerId: this.user.userId, hostGameId: body.hostGameId });
        });

        this.store.state.socket.on('invitationInGameDeclined', (body) => {
          this.hostName = body.host;
          this.store.commit('SET_INVITED', false);
          deleteGameRoomById(body.hostGameId.toString());
          this.inviteInGameFailed = true;
          setTimeout(() => {
            this.inviteInGameFailed = false;
          }, 5000);
        });

        this.store.state.socket.on('kicked', (body) => {
          this.channelNameKicked = body.channelName;
          this.kickedSuccess = true;
          setTimeout(() => {
            this.kickedSuccess = false;
          }, 5000);
        });

        this.store.state.socket.on('muted', (body) => {
          this.channelNameMuted = body.channelName;
          this.mutedSuccess = true;
          setTimeout(() => {
            this.mutedSuccess = false;
          }, 5000);
        });

        this.store.state.socket.on('newUser', async (body) => {
          this.users = await getAllUsers(this.cookieJWT);
        });

        this.store.state.socket.on('receiveMessage', async (body) => {
          this.privateMessages = await getPrivateMessagesByUserName(this.user.userName, this.cookieJWT);
          this.messageSenderName = body.userName;
          this.messageSuccess = true;
          setTimeout(() => {
            this.messageSuccess = false;
          }, 5000);
        });

        this.store.state.socket.on('updateDM', async (body) => {
          await deletePrivateMessages(body.userName, this.user.userName, this.cookieJWT);
          this.privateMessages = await getPrivateMessagesByUserName(this.user.userName, this.cookieJWT);
        });

      },
      closeMessageModal() {
        this.modalMessage = false; this.modalIsOpen = false;
        if (window.location.pathname === "/game" && this.modalMessage === false)
          this.store.dispatch('modalClose', { socket : this.user.socket });
      },
      openMessageModal(userName, message) { 
        this.modalMessage = true; this.currentUserName = userName;
        this.senderName = (message.senderName === userName) ? message.receiverName : message.senderName; this.modalIsOpen = true;
        if (window.location.pathname === "/game" && this.modalMessage === true)
          this.store.dispatch('modalOpen', { socket : this.user.socket });
      },
      openMessageModalFromAlert(senderName, userName) { 
        this.modalMessage = true; this.currentUserName = userName;
        this.senderName = senderName; this.messageSuccess = false; this.modalIsOpen = true;
        if (window.location.pathname === "/game" && this.modalMessage === true)
          this.store.dispatch('modalOpen', { socket : this.user.socket });
      },
    },
    async mounted() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', this.theme);
      }
      let cookieUserId = Cookies.get('UserId');
		  this.cookieJWT = Cookies.get('Bearer');

      if (typeof cookieUserId !== 'undefined' && typeof this.cookieJWT !== 'undefined')
        this.user = await getUserByUserId(cookieUserId, this.cookieJWT);
      else
        return ;
      this.userName = this.user.userName;
      this.privateMessages = await getPrivateMessagesByUserName(this.user.userName, this.cookieJWT);
      this.imageSrc = await getImage(this.user.image);
      this.users = await getAllUsers(this.cookieJWT);
      await setClientSocket(this.user.userName, this.store.state.socket.id, this.cookieJWT);
      this.socketOn();
    },
  };
</script>

<template>
  <Alert :inviteInGameFailed="inviteInGameFailed" :inviteInGameSuccess="inviteInGameSuccess" :invitationInGameSuccess="invitationInGameSuccess"
    :messageSuccess="messageSuccess" :messageSenderName="messageSenderName" :userName="userName" :hostName="hostName"
    :privateMessage="privateMessages" :openMessageModalFromAlert="openMessageModalFromAlert" :socketEmit="socketEmit"
    :invitationFriendSuccess="invitationFriendSuccess" :friendRequestAccepted="friendRequestAccepted" :friendRequestDeclined="friendRequestDeclined"
    :mutedSuccess="mutedSuccess" :channelNameMuted="channelNameMuted" :bannedSuccess="bannedSuccess" :channelNameBanned="channelNameBanned"
    :channelNameKicked="channelNameKicked" :kickedSuccess="kickedSuccess" :userDoesntExist="userDoesntExist" :modalIsOpen="modalIsOpen"
  />
  <div class="navbar h-74 bg-base-100">
    <div class="navbar-start">
      <Drawer :user="user" :imageSrc="imageSrc" :logout="logout" :display="false" :userName="userName" :jwtToken="cookieJWT" :start="true"/>
    </div>
    <div class="navbar-center flex space-x-4">
      <img src="../assets/search-svgrepo-com.svg" width="32" height="32"/>
      <input name="searchBar" type="text" placeholder="Search" class="font-mono input input-bordered w-24 md:w-auto" v-model="searchInput"/>
      <div v-if="filteredUsers && filteredUsers.length > 0" v-show="searchInput" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li v-for="user in filteredUsers" :key="user.id">
          <router-link :to="'/profile/' + user.userName" @click.native="resetSearchBar(user.userName)">{{ user.userName }}</router-link>
        </li>     
      </div>
    </div>
    <div class="navbar-end">
      <Drawer v-if="user"
        :display="true"
        :imageSrc="imageSrc"
        :user="user"
        :jwtToken="cookieJWT"

        :currentUserName="currentUserName"
        :displayName="this.user.userName"
        :senderName="senderName"
        :userName="userName"

        :closeMessageModal="closeMessageModal"
        :modalMessage="modalMessage"
        :openMessageModal="openMessageModal"
        :privateMessages="privateMessages"

        :createPrivateMessageInDB="createPrivateMessageInDB"
        :logout="logout"

        :start="false"
      />
      <Modal :senderName="senderName" :jwtToken="cookieJWT" :userName="userName"/>
    </div>
  </div>
</template>

<style scoped>
.navbar-center { position: relative; }
.menu { position: absolute; top: 100%; z-index: 1; }
</style>