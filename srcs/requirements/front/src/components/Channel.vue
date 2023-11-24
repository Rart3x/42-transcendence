<script setup>
  import Alert from './Alert.vue';
  import Cookies from "js-cookie";
  import { removeOperator, removeUserFromChannel } from "./api/delete.call";
  import { getMessagesFromChannel, getUsersFromChannel, getChannelByName, getUserByCookie } from "./api/get.call";
  import { addOperator, banUserFromChannel, insertMessageToChannel, muteUserFromChannel } from "./api/post.call";
  import { computed, nextTick, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";

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

  const isOperatorInDB = async (channelName, userId) => {
    const channel = await getChannelByName(channelName);
    if (channel && channel.channelOperators)
      return channel.channelOperators.some(operator => operator.userId === userId);
  };

  const isUserMuteInChannelInDB = async (channelName, userId) => {
    const channel = await getChannelByName(channelName);
    if (channel && channel.channelUsersMute)
      return channel.channelUsersMute.some(operator => operator.userId === userId);
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

    if (channel.value && channel.value.channelUsers) {
      const userWithSameId = channel.value.channelUsers.find(user => user.userId === actualUser.value.userId);
      if (!userWithSameId) window.location.href = "/profile";
    }

    if (actualUser.value.image) {
      let userImagePath = "../assets/userImages/" + actualUser.value.image;
      await import(/* @vite-ignore */ userImagePath).then((userImage) => {
        actualUser.value.image = userImage.default;
      });
    }
    actualUserMuted.value = await isUserMuteInChannelInDB(route.params.channelName, actualUser.value.userId);

    let usersData = await getUsersFromChannel(route.params.channelName);
    for (let user of usersData) {
      let imagePath = "../assets/userImages/" + user.image;
      await import(/* @vite-ignore */ imagePath).then((image) => {
        user.imageSrc = image.default;
      });
      user.isOperator = await isOperatorInDB(route.params.channelName, user.userId);
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
  <div class="navbar bg-base-100 overflow-x-auto bg-base-200 font-mono">
    <div class="navbar-end">
      <details class="dropdown">
        <summary class="m-1 btn glass">{{ $route.params.channelName }}</summary>
        <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
          <li @click="removeUserFromChannelInDB($route.params.channelName, actualUser.userName)">Quit</li>
        </ul>
      </details>
    </div>
  </div>
  <div class="grid-container font-mono">
    <div class="overflow-x-auto min-h-screen bg-base-200">
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
              <td v-if="channel.channelAdmin == actualUser.userId">
                <div v-if="user.userId != channel.channelAdmin" class="isAdmin">
                  <button class="btn glass btn-error" @click="banUserFromChannelInDB($route.params.channelName, user.userName)">Ban</button>
                  <button class="btn glass btn-warning" @click="muteUserFromChannelInDB($route.params.channelName, user.userName)">Mute</button>
                  <button class="btn glass btn-error" @click="removeUserFromChannelInDB($route.params.channelName, user.userName)">Kick</button>
                  <button v-if="!user.isOperator" class="btn glass btn-success" @click="addOperator($route.params.channelName, user.userName)" >Promote</button>
                  <button v-else-if="user.isOperator" class="btn glass btn-error" @click="removeOperator($route.params.channelName, user.userName)">Depreciate</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--Chat-->
    <div class="overflow-x-auto min-h-screen bg-base-200 chat-box" style="text-align: center">
      <div class="chat-messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          <div class="message-row">
            <div v-if="message.userId != actualUser.userId && message.message_text">
              <div class="chat chat-start">
                <label tabindex="0" class="btn btn-ghost btn-circle">
                  <div class="avatar">
                    <div class="w-15 mask mask-squircle" v-if="message.sender">
                      <img :src="message.sender.image" />
                    </div>
                  </div>
                </label>
                <div class="chat-bubble">{{ message.message_text }}</div>
                <div class="message-timestamp"> {{ message.message_date }} </div>
                </div>
            </div>
            <div v-else-if="message.message_text">
              <div class="chat chat-end">
                <div class="chat-bubble">{{ message.message_text }}</div>
                <label tabindex="0" class="btn btn-ghost btn-circle">
                  <div class="avatar">
                    <div class="w-15 mask mask-squircle">
                      <img :src="actualUser.image" />
                    </div>
                  </div>
                </label>
                <div class="message-timestamp"> {{ message.message_date }} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <div class="userMutedOrNot" v-if="!actualUserMuted" style="position: absolute; bottom: 15vh; left: 75%; transform: translateX(-50%);">
          <input type="text" class="input input-bordered w-full max-w-xs" id="message_text" @keyup.enter="sendMessage(message_text)" placeholder="Send Message" v-model="message_text"/>
          <button class="btn glass btn-primary" @click="sendMessage">Send</button>
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