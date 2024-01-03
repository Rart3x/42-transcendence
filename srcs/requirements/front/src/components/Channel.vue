<script setup>
  import Alert from './Alert.vue';
  import Modal from './Modal.vue';
  import Cookies from "js-cookie";
  import { removeChannel, removeOperator, removeUserFromChannel, unmuteUser} from "./api/delete.call";
  import { getMessagesFromChannel, getUsersFromChannel, getChannelByName, getUserByUserId, getImage } from "./api/get.call";
  import { addOperator, banUserFromChannel, insertMessageToChannel, muteUserFromChannel, setAdmin } from "./api/post.call";
  import { computed, nextTick, onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useStore } from "vuex";

  let actualUser = ref(null);
  let channel = ref(null);
  let messages = ref([]);
  let users = ref([]);

  let channelNameMute = ref("");

  let message_text = ref("");

  let banSuccess = ref(false);
  let kickSuccess = ref(false);
  let muteSuccess = ref(false);

  let banFailed = ref(false);
  let kickFailed = ref(false);
  let muteFailed = ref(false);

  let actualUserMuted = ref(false);
  let modalMuteUser = ref(false);
  let userMuted = ref("");

  let selectedDuration = ref(1);

  const route = useRoute();
  const router = useRouter();

  let cookieJWT = ref(null);
  const store = useStore();

  const addOperatorInDB = async (channelName, userName) => {
    const response = await addOperator(channelName, userName, cookieJWT.value);
    updateOperator(users.value, route.params.channelName, cookieJWT.value);
  };

  const removeOperatorInDB = async (channelName, userName) => {
    const response = await removeOperator(channelName, userName);
    updateOperator(users.value, route.params.channelName, cookieJWT.value);
  };

  const closeMuteModal = () => { modalMuteUser.value = false; };
  const openMuteModal = (userMutedName) => { modalMuteUser.value = true; userMuted.value = userMutedName};

  const banUserFromChannelInDB = async (channelName, userName) => {
    const response = await banUserFromChannel(channelName, userName, cookieJWT.value);

    if (response && response.success) {
      banSuccess.value = true;
      setTimeout(() => {
        banSuccess.value = false;
      }, 3000);
    } 
    else {
      banFailed.value = true;
      setTimeout(() => {
        banFailed.value = false;
      }, 3000);
    }
    updateBan(users.value, route.params.channelName, jwtToken);
  };

  const isOperatorInDB = async (channelName, userId) => {
    const channel = await getChannelByName(channelName, cookieJWT.value);
    if (channel && channel.channelOperators)
      return channel.channelOperators.some(operator => operator.userId === userId);
  };

  const isUserBanInChannelInDB = async (channelName, userId) => {
    const channel = await getChannelByName(channelName, cookieJWT.value);
    if (channel && channel.channelUsersMute)
      return channel.channelUsersBan.some(user => user.userId === userId);
  };

  const isUserMuteInChannelInDB = async (channelName, userId) => {
    const channel = await getChannelByName(channelName, cookieJWT.value);
    if (channel && channel.channelUsersMute)
      return channel.channelUsersMute.some(operator => operator.userId === userId);
  };

  const muteUserFromChannelInDB = async (channelNameMute, userName, selectedDuration) => {
    const response = await muteUserFromChannel(channelNameMute, userName, selectedDuration, cookieJWT.value);

    if (response && response.success) {
      muteSuccess.value = true;
      setTimeout(() => {
        muteSuccess.value = false;
      }, 3000);
    } 
    else {
      muteFailed.value = true;
      setTimeout(() => {
        muteFailed.value = false;
      }, 3000);
    }
    users.value = await getUsersFromChannel(route.params.channelName, cookieJWT.value);
    updateUserImages(users.value);
    channel.value = await getChannelByName(route.params.channelName, cookieJWT.value);
  };

  const removeUserFromChannelInDB = async (channelName, userName) => {
    const chan = await getChannelByName(channelName, cookieJWT.value);

    if (actualUser.value.userId === chan.channelAdmin) { 
      if (chan.channelOperators.length > 0) {
        const newAdmin = chan.channelOperators[Math.floor(Math.random() * chan.channelOperators.length)];
        await setAdmin(channelName, newAdmin.userName, cookieJWT.value);
        await removeOperator(channelName, newAdmin.userName, cookieJWT.value);
      }
      else
        await removeChannel(channelName, cookieJWT.value);
    }

    const response = await removeUserFromChannel(channelName, userName, cookieJWT.value);

    if (response && response.success) {
      kickSuccess.value = true;
      setTimeout(() => {
        kickSuccess.value = false;
      }, 3000);
    } 
    else {
      kickFailed.value = true;
      setTimeout(() => {
        kickFailed.value = false;
      }, 3000);
    }
    users.value = await getUsersFromChannel(route.params.channelName, cookieJWT.value);
    updateUserImages(users.value);
    router.push("/profile");
  };

  const filteredUsers = computed(() => {
    return users.value.filter(
      (user) => actualUser.value.userName !== user.userName
    );
  });

  const sendMessage = async () => {
    if (message_text.value) {
      await insertMessageToChannel( route.params.channelName, message_text.value, actualUser.value, cookieJWT.value );
      messages.value = await getMessagesFromChannel(route.params.channelName, cookieJWT.value);
      await nextTick();
      scrollToBottom();
      message_text.value = "";

      const usersInChannel = await getUsersFromChannel(route.params.channelName, cookieJWT.value);
      await store.dispatch('messageToChannel', { usersInChannel } );
    }
  };

  const socketOn = async () => {
    store.state.socket.on('messageToChannel', async (body) => {
      messages.value = await getMessagesFromChannel(route.params.channelName, cookieJWT.value);
      await updateMessageSenders(messages.value);
      await nextTick();
      scrollToBottom();
    });
  };

  const scrollToBottom = () => {
    const container = document.querySelector(".chat-messages");
    if (container)
      container.scrollTop = container.scrollHeight;
  };

  async function updateBan(users, channelName) {
    for (let user of users) {
      user.isBan = await isUserBanInChannelInDB(channelName, user.userId, cookieJWT.value);
    }
  }

  async function updateOperator(users, channelName) {
    for (let user of users) {
      user.isOperator = await isOperatorInDB(channelName, user.userId, cookieJWT.value);
    }
    actualUser.value.isOperator = await isOperatorInDB(route.params.channelName, actualUser.value.userId, cookieJWT.value);
  }

  async function updateMessageSenders(messages) {
    for (let message of messages) {
      if (message.sender) {
        message.sender.image = await getImage(message.sender.image);
        message.sender.isBan = await isUserBanInChannelInDB(route.params.channelName, message.sender.userId, cookieJWT.value);
      }
    }
  }

  async function updateUserImages(users) {
    for (let user of users) {
      user.imageSrc = await getImage(user.image);
      user.isOperator = await isOperatorInDB(route.params.channelName, user.userId, cookieJWT.value);
    }
  }

  const checkMuteStatus = async () => {
    const currentTime = new Date();

    for (const user of users.value) {
      if (user.userId !== actualUser.value.userId) {
        const isMuted = await isUserMuteInChannelInDB(route.params.channelName, user.userId, cookieJWT.value);
        
        if (isMuted) {
          const muteDetails = channel.value.channelUsersMute.find(user => user.userId === user.userId).mutedUntil;
          const muteUntil = new Date(muteDetails);

          if (currentTime > muteUntil) {  
            await unmuteUser(route.params.channelName, user.userName, cookieJWT.value);
            user.isMuted = false;
          }
        }
      }
    }
    users.value = await getUsersFromChannel(route.params.channelName, cookieJWT.value);
    updateUserImages(users.value);
  };

  setInterval(checkMuteStatus, 30000);

  onMounted(async () => {
    let cookieUserId = Cookies.get('UserId');
		cookieJWT.value = Cookies.get('Bearer');
    
    if (typeof cookieUserId !== 'undefined' && typeof cookieJWT.value !== 'undefined'){

			actualUser.value = await getUserByUserId(cookieUserId, cookieJWT.value);

      actualUser.value.isOperator = await isOperatorInDB(route.params.channelName, actualUser.value.userId, cookieJWT.value);

      channel.value = await getChannelByName(route.params.channelName, cookieJWT.value);
      channelNameMute.value = route.params.channelName;

      if (channel.value && channel.value.channelUsers) {
        const userWithSameId = channel.value.channelUsers.find(user => user.userId === actualUser.value.userId);
        if (!userWithSameId) window.location.href = "/profile";
      }

      if (actualUser.value.image) {
        let userImagePath =  actualUser.value.image;
        actualUser.value.image = await getImage(actualUser.value.image);
      }
      actualUserMuted.value = await isUserMuteInChannelInDB(route.params.channelName, actualUser.value.userId, cookieJWT.value);

      let usersData = await getUsersFromChannel(route.params.channelName, cookieJWT.value);
      await updateUserImages(usersData);

      messages.value = await getMessagesFromChannel(route.params.channelName, cookieJWT.value);

      scrollToBottom();
      await updateMessageSenders(messages.value, cookieJWT.value);
      users.value.splice(0, users.value.length, ...usersData);
      socketOn();
		}
  });
</script>
 
<template>
  <div class="navbar bg-base-200 font-mono">
    <div class="navbar-end">
      <details class="dropdown">
        <summary class="m-1 btn glass">{{ $route.params.channelName }}</summary>
        <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 dark-row">
          <li @click="removeUserFromChannelInDB($route.params.channelName, actualUser.userName)">Quit</li>
        </ul>
      </details>
    </div>
  </div>
  <div class="grid-container font-mono">
    <div class="overflow-x-auto min-h-screen bg-base-200">
      <div v-if="filteredUsers && filteredUsers.length > 0" class="friend-list">
        <div class="friend-list">
          <table class="table table-zebra">
            <tbody v-for="user in filteredUsers" :key="user.userName">
              <tr class="dark-row">
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
                <td v-if="channel.channelAdmin == actualUser.userId || actualUser.isOperator">
                  <div v-if="user.userId != channel.channelAdmin" class="isAdmin">
                    <button class="btn glass btn-error" @click="banUserFromChannelInDB($route.params.channelName, user.userName)">Ban</button>
                    <button class="btn glass btn-warning" @click="openMuteModal(user.userName)">Mute</button>
                    <button class="btn glass btn-error" @click="removeUserFromChannelInDB($route.params.channelName, user.userName, )">Kick</button>
                    <button v-if="!user.isOperator" class="btn glass btn-success" @click="addOperatorInDB($route.params.channelName, user.userName)" >Promote</button>
                    <button v-else-if="user.isOperator" class="btn glass btn-error" @click="removeOperatorInDB($route.params.channelName, user.userName)">Depreciate</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <input v-else type="text" class="input input-bordered w-full max-w-xs" placeholder="No Members" disabled />
    </div>
    <!--Chat-->
    <div class="overflow-x-auto min-h-screen bg-base-200 chat-box" style="text-align: center">
      <div v-if="messages && messages.length > 0" class="chat-messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          <div v-if="message.sender && !message.sender.isBan" class="message-row">
            <div v-if="message.userId != actualUser.userId && message.message_text">
              <div class="chat chat-start">
                <router-link :to="`/profile/` + message.sender.userName">
                  <label tabindex="0" class="btn btn-ghost btn-circle">
                    <div class="avatar">
                      <div class="w-15 mask mask-squircle" v-if="message.sender">
                        <img :src="message.sender.image" />
                      </div>
                    </div>
                  </label>
                </router-link>
                <div class="chat-bubble">{{ message.message_text }}</div>
                <div class="message-timestamp"> {{ message.message_date.substring(11, 16) }} </div>
                </div>
            </div>
            <div v-else-if="message.message_text">
              <div class="chat chat-end">
                <div class="chat-bubble">{{ message.message_text }}</div>
                <router-link :to="`/profile/` + actualUser.userName">
                  <label tabindex="0" class="btn btn-ghost btn-circle">
                    <div class="avatar">
                      <div class="w-15 mask mask-squircle">
                        <img :src="actualUser.image" />
                      </div>
                    </div>
                  </label>
                </router-link>
                <div class="message-timestamp"> {{ message.message_date.substring(11, 16) }} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <input v-else type="text" class="input input-bordered w-full max-w-xs" placeholder="No Messages" disabled/>
      <div class="chat-input">
        <div class="userMutedOrNot" v-if="!actualUserMuted" style="position: absolute; bottom: 15vh; left: 75%; transform: translateX(-50%);">
          <input type="text" class="input input-bordered w-full max-w-xs" id="message_text" @keyup.enter="sendMessage(message_text)" placeholder="Send Message" v-model="message_text"/>
          <button class="btn glass btn-primary" @click="sendMessage(message_text)">Send</button>
        </div>
        <input v-else type="text" class="input input-bordered w-full max-w-xs" placeholder="You are muted" disabled/>
      </div>
    </div>
  </div>
  <Alert
    :kickSuccess="kickSuccess"
    :kickFailed="kickFailed"
    :muteSuccess="muteSuccess"
    :muteFailed="muteFailed"
    :banSuccess="banSuccess"
    :banFailed="banFailed"
  />
  <Modal
    :muteUserFromChannelInDB="muteUserFromChannelInDB"
    :closeMuteModal="closeMuteModal"
    :modalMuteUser="modalMuteUser" :parent="'channel'"
    :channelNameMute="channelNameMute"
    :userMuted="userMuted"

  />
</template>

<style scoped>
.chat-messages { max-height: 55vh; overflow-x: auto; }
  .chat-messages::-webkit-scrollbar-thumb { background: #888; }
  .chat-messages::-webkit-scrollbar-thumb:hover { background: #555; }
  .chat-messages::-webkit-scrollbar-track { background: #ddd; }
  
  .friend-list { max-height: 85vh; overflow-x: auto; }
  .friend-list::-webkit-scrollbar-thumb { background: #888; }
  .friend-list::-webkit-scrollbar-thumb:hover { background: #555; }
  .friend-list::-webkit-scrollbar-track { background: #ddd; }
  .dark-row:hover { background-color: #364e6e; }
  .grid-container { display: grid; grid-template-columns: 1fr 1fr; height: 85vh; }
</style>