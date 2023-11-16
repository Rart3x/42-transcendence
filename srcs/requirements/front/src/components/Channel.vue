<script setup>
  import Cookies from "js-cookie";
  import { removeOperator, removeUserFromChannel } from "./api/delete.call";
  import { getMessagesFromChannel, getUsersFromChannel, getChannelByName, getUserByCookie, isUserBanInChannel, isOperator, isUserMuteInChannel } from "./api/get.call";
  import { addOperator, banUserFromChannel, insertMessageToChannel, muteUserFromChannel } from "./api/post.call";
  import { computed, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { nextTick } from "vue";

  let actualUser = ref(null);
  let channel = ref(null);
  let messages = ref([]);
  let users = ref([]);

  let message_text = ref("");

  const route = useRoute();

  let banSuccess = ref(false);
  let kickSuccess = ref(false);
  let muteSuccess = ref(false);

  let banFailed = ref(false);
  let kickFailed = ref(false);
  let muteFailed = ref(false);

  let actualUserMuted = ref(false);

  const banUserFromChannelInDB = async (channelName, userName) => {
    const response = await banUserFromChannel(channelName, userName);

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
    users.value = await getUsersFromChannel(route.params.channelName);
  };

  const isOperatorInDB = async (channelName, userName) => {
    const response = await isOperator(channelName, userName);
    console.log(response.success);
    return response.success;
  };

  const isUserMuteInChannelInDB = async () => {
    const response = await isUserMuteInChannel(route.params.channelName, actualUser.value.userName);
    actualUserMuted.value = response.success;
  };

  const muteUserFromChannelInDB = async (channelName, userName) => {
    const response = await muteUserFromChannel(channelName, userName);

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
    users.value = await getUsersFromChannel(route.params.channelName);
  };

  const removeUserFromChannelInDB = async (channelName, userName) => {
    const response = await removeUserFromChannel(channelName, userName);

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
    users.value = await getUsersFromChannel(route.params.channelName);
  };

  const filteredUsers = computed(() => {
    return users.value.filter(
      (user) => actualUser.value.userName !== user.userName
    );
  });

  const sendMessage = async () => {
    if (message_text.value) {
      await insertMessageToChannel(
        route.params.channelName,
        message_text.value,
        actualUser.value
      );
      messages.value = await getMessagesFromChannel(route.params.channelName);
      await nextTick();
      scrollToBottom();
      message_text.value = "";
    }
  };

  const scrollToBottom = () => {
    const container = document.querySelector(".chat-messages");
    if (container)
      container.scrollTop = container.scrollHeight;
  };

  onMounted(async () => {
    actualUser.value = await getUserByCookie(Cookies.get("_authToken"));

    if (!actualUser.value) window.location.href = "/";

    channel.value = await getChannelByName(route.params.channelName);

    if (actualUser.value.image) {
      let userImagePath = "../assets/userImages/" + actualUser.value.image;
      await import(/* @vite-ignore */ userImagePath).then((userImage) => {
        actualUser.value.image = userImage.default;
      });
    }

    let usersData = await getUsersFromChannel(route.params.channelName);
    for (let user of usersData) {
      let imagePath = "../assets/userImages/" + user.image;
      await import(/* @vite-ignore */ imagePath).then((image) => {
        user.imageSrc = image.default;
      });
    }

    messages.value = await getMessagesFromChannel(route.params.channelName);

    scrollToBottom();
    for (let message of messages.value) {
      if (message.sender) {
        let imagePath = "../assets/userImages/" + message.sender.image;
        await import(/* @vite-ignore */ imagePath).then((image) => {
          message.sender.image = image.default;
        });
      }
    }
    users.value.splice(0, users.value.length, ...usersData);
  });
</script>

<template>
  <div class="navbar bg-base-100">
    <button class="btn btn-ghost normal-case text-xl">{{ $route.params.channelName }}</button>
  </div>
  <div class="grid-container">
    <div class="overflow-x-auto">
      <div class="friend-list">
        <table class="table table-zebra">
          <tbody v-for="user in filteredUsers" :key="user.userName">
            <tr class="dark-row">
              <td>
                <label tabindex="0" class="btn btn-ghost btn-circle">
                  <div class="avatar">
                    <div class="w-24 mask mask-squircle">
                      <img :src="user.imageSrc" />
                    </div>
                  </div>
                </label>
              </td>
              <td>
                <router-link :to="'/profile/' + user.userName"> <button class="btn no-animation">{{ user.userName }}</button> </router-link>
              </td>
              <td v-if="channel.channelAdmin == actualUser.userId || isOperatorInDB($route.params.channelName, user.userName)">
                <div class="isAdmin" v-if="user.userId != channel.channelAdmin">
                  <button class="btn btn-warning" @click="banUserFromChannelInDB($route.params.channelName, user.userName)">Ban</button>
                  <button class="btn btn-warning" @click="muteUserFromChannelInDB($route.params.channelName, user.userName)">Mute</button>
                  <button class="btn btn-error" @click="removeUserFromChannelInDB($route.params.channelName, user.userName)">Kick</button> 
                  <button class="btn btn-success" @click="addOperator($route.params.channelName, user.userName)" v-if="user && !isOperatorInDB($route.params.channelName, user.userName)">Promote</button>
                  <button class="btn btn-error" @click="removeOperator($route.params.channelName, user.userName)" v-else>Depreciate</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Center Chat on mid Grid -->
    <!-- Penser a ajouter lhoraire denvoi et aussi le focus de la navabar en bas de la box-->
    <div class="chat-box" style="text-align: center">
      <div class="chat-messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          <div class="message-row">
            <div v-if="message.userId !== actualUser.userId">
              <div class="chat chat-start">
                <label tabindex="0" class="btn btn-ghost btn-circle">
                  <div class="avatar">
                    <div class="w-24 mask mask-squircle">
                      <!-- <img :src="message.sender.image" /> -->
                    </div>
                  </div>
                </label>
                <div class="chat-bubble" v-if="messages.message_text">{{ message.message_text }}</div>
              </div>
            </div>
            <div v-if="message.userId === actualUser.userId">
              <div class="chat chat-end">
                <div class="chat-bubble">{{ message.message_text }}</div>
                <label tabindex="0" class="btn btn-ghost btn-circle">
                  <div class="avatar">
                    <div class="w-24 mask mask-squircle">
                      <img :src="actualUser.image" />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-input">
        {{ isUserMuteInChannelInDB() }}
        <div class="userMutedOrNot" v-if="!actualUserMuted">
          <input  type="text" class="input input-bordered w-full max-w-xs" id="message_text" @keyup.enter="sendMessage(message_text)" placeholder="Send Message" v-model="message_text"/>
          <button class="btn btn-primary" @click="sendMessage">Send</button>
        </div>
        <input v-else type="text" class="input input-bordered w-full max-w-xs" placeholder="You are muted" disabled/>

      </div>
    </div>
  </div>
  <!--Alerts-->
  <div v-if="kickSuccess" class="toast toast-start">
    <div class="alert alert-success">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>User has been kicked successfully</span>
    </div>
  </div>
  <div v-if="kickFailed" class="toast toast-start">
    <div class="alert alert-error">
      <span>Failed to kick User</span>
    </div>
  </div>

  <div v-if="muteSuccess" class="toast toast-start">
    <div class="alert alert-success">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>User has been muted successfully</span>
    </div>
  </div>
  <div v-if="muteFailed" class="toast toast-start">
    <div class="alert alert-error">
      <span>Failed to mute User</span>
    </div>
  </div>

  <div v-if="banSuccess" class="toast toast-start">
    <div class="alert alert-success">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>User has been banned successfully</span>
    </div>
  </div>
  <div v-if="banFailed" class="toast toast-start">
    <div class="alert alert-error">
      <span>Failed to ban User</span>
    </div>
  </div>
</template>

<style scoped>
  .chat-messages {
    max-height: 55vh;
    overflow-x: auto;
  }
  .chat-messages::-webkit-scrollbar-thumb { background: #888; }
  .chat-messages::-webkit-scrollbar-thumb:hover { background: #555; }
  .chat-messages::-webkit-scrollbar-track { background: #ddd; }

  .friend-list {
    max-height: 55vh;
    overflow-x: auto;
  }
  .friend-list::-webkit-scrollbar-thumb { background: #888; }
  .friend-list::-webkit-scrollbar-thumb:hover { background: #555; }
  .friend-list::-webkit-scrollbar-track { background: #ddd; }
  
  .dark-row:hover { background-color: #364e6e; }
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 10vh;
  }
  tbody tr:hover { background-color: #efefef; }
</style>