<script>
  import Alert from "./Alert.vue";
  import Cookies from "js-cookie";
  import Drawer from "./Drawer.vue";
  import Modal from "./Modal.vue";
  import { inviteFriendInGameEXPORT, socketOnEXPORT } from "./UserProfile.vue";
  import { getAllUsers, getPrivateMessagesByUserName, getUserByUserId, getUserByUserName, getImage } from "./api/get.call.ts";
  import { createPrivateMessage, setStatus, setClientSocket } from "./api/post.call.ts";
  import { deleteGameRoomById } from "./api/delete.call.ts";
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

        currentUserName: "",
        messageSenderName: "",
        hostName: "",
        senderName: "",
        userName: "",

        invitationInGameSuccess: false,
        inviteInGameSuccess: false,
        inviteInGameFailed: false,
        messageSuccess: false,

        cookieJWT: null,
        store: useStore(),
        router: useRouter(),
      };
    },
    computed: {
      filteredUsers() {
        if (!this.users)
          return [];
        try {
          const searchInputValue = this.searchInput;
          if (!searchInputValue || !this.users)
            return [];
          return this.users.filter(user =>
            user.userName && user.userName.includes(searchInputValue) ||
            user.displayName && user.displayName.includes(searchInputValue)
          );
        }
        catch (error) {
          return [];
        }
      }
    },
    methods: {
      async createPrivateMessageInDB(userName, senderName, message_text) {
        const user1 = await getUserByUserName(senderName, this.cookieJWT);
        const socket = user1.socket;
        if (message_text === "/game") { 
          message_text = "";
          this.modalMessage = false;
          inviteFriendInGameEXPORT(user1.userName, user1.userId, user1.userSocket, user1.userStatus, this.user, this.cookieJWT);
        }
        await createPrivateMessage(userName, senderName, message_text, this.cookieJWT);
        await this.store.dispatch('sendPrivateMessage', { senderName, socket, userName } );
        this.privateMessages = await getPrivateMessagesByUserName(this.user.userName, this.cookieJWT);
      },
      logout() {
        //Remove cookies and set user status to "offline"
        Cookies.remove("UserId");
        Cookies.remove("Bearer");
        if (this.user)
          setStatus(this.user.userName, "offline", this.cookieJWT);
        window.location.href = "/";
      },
      async socketEmit(emit) {
        const hostUser = await getUserByUserName(this.hostName, this.cookieJWT);
        if (emit == "invitationInGameAccepted" || emit == "invitationInGameDeclined")
          this.invitationInGameSuccess = false;
        if (emit == "invitationInGameAccepted"){
          this.router.push('/game');
          // this.store.state.socket.emit('localGame', { playerId: this.user.userId, hostGameId: this.hostGame.id })
        }
        this.store.state.socket.emit(emit, { host: hostUser.userName, socket: hostUser.socket,  hostGameId: this.hostGame.id });
      },

      async socketOn() {

        this.store.state.socket.on('invitedInGame', (body) => {
          this.hostGame = body.gameRoom;
          this.hostName = body.host;
          this.invitationInGameSuccess = true;
          setTimeout(() => {
            this.invitationInGameSuccess = false;
          }, 30000);
        });

        this.store.state.socket.on('invitationAccepted', (body) => {
          this.hostName = body.host;
          this.router.push('/game');
          // this.store.state.socket.emit('localGame', { playerId: this.user.userId, hostGameId: body.hostGameId });
        });

        this.store.state.socket.on('invitationDeclined', (body) => {
          this.hostName = body.host;
          deleteGameRoomById(body.hostGameId.toString());
          this.inviteInGameFailed = true;
          setTimeout(() => {
            this.inviteInGameFailed = false;
          }, 5000);
        });

        this.store.state.socket.on('receiveMessage', async (body) => {
          this.privateMessages = await getPrivateMessagesByUserName(this.user.userName, this.cookieJWT);
          this.messageSenderName = body.userName;
          this.messageSuccess = true;
          setTimeout(() => {
            this.messageSuccess = false;
          }, 3000);
        });
      },

      closeMessageModal() { this.modalMessage = false; },
      openMessageModal(userName, message) { console.log(userName, message); this.modalMessage = true; this.currentUserName = userName; this.senderName = (message.senderName === userName) ? message.receiverName : message.senderName; },
      openMessageModalFromAlert(senderName, userName) { this.modalMessage = true; this.currentUserName = userName; this.senderName = senderName; },
    },
    async mounted() {
      let cookieUserId = Cookies.get('UserId');
		  this.cookieJWT = Cookies.get('Bearer');

      if (typeof cookieUserId !== 'undefined' && typeof this.cookieJWT !== 'undefined')
        this.user = await getUserByUserId(cookieUserId, this.cookieJWT);
      else
        return ;
      this.userName = this.user.displayName;
      this.privateMessages = await getPrivateMessagesByUserName(this.user.userName, this.cookieJWT);
      this.imageSrc = await getImage(this.user.image);
      this.users = await getAllUsers(this.cookieJWT);
      await setClientSocket(this.user.userName, this.store.state.socket.id, this.cookieJWT);
      this.socketOn();
    }
  };
</script>

<template>
  <Alert :inviteInGameFailed="inviteInGameFailed" :inviteInGameSuccess="inviteInGameSuccess" :invitationInGameSuccess="invitationInGameSuccess"
    :messageSuccess="messageSuccess" :messageSenderName="messageSenderName" :userName="userName" :hostName="hostName"
    :privateMessage="privateMessages" :openMessageModalFromAlert="openMessageModalFromAlert" :socketEmit="socketEmit"
  />
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <Drawer :user="user" :imageSrc="imageSrc" :logout="logout" :display="false" :userName="userName" :jwtToken="cookieJWT" :start="true"/>
    </div>
    <div class="navbar-center">
      <input type="text" placeholder="Search" class="font-mono input input-bordered w-24 md:w-auto" v-model="searchInput"/>
      <div v-show="searchInput" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <router-link v-for="user in filteredUsers" :key="user.id" :to="'/profile/' + user.userName" class="dropdown-item">{{ user.userName }}</router-link>
      </div>
    </div>
    <div class="navbar-end">
      <Drawer v-if="user"
        :display="true"
        :imageSrc="imageSrc"
        :user="user"
        :jwtToken="cookieJWT"

        :currentUserName="currentUserName"
        :displayName="this.user.displayName"
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