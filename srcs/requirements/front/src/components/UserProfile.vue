<script setup>
  import Cookies from "js-cookie";
  import { onMounted, ref } from "vue";
  import { removeChannel, removeFriend } from "./api/delete.call";
  import { getAllChannels, getAllFriends, getUserByCookie } from "./api/get.call";
  import { addFriend, createChannel } from './api/post.call';

  const friendName = ref("");
  const modalChannel = ref(false);
  const userName = ref("");

  let channels = ref([]);
  let friends = ref([]);

  let adminImage = ref(null);
  let imageAdminPath;

  let user = ref(null);

  let addFriendSuccess = false;
  let removeFriendSuccess = false;

  const addFriendFromDB = async (userName, friendName) => {
    const response = await addFriend(userName, friendName);
    if (response.ok)
      addFriendSuccess = true;
    else
      addFriendSuccess = false;
  };

  const removeFriendFromDB = async (userName, friendName) => {
    const response = await removeFriend(userName, friendName);
    if (response.ok)
      removeFriendSuccess = true;
    else
      removeFriendSuccess = false;
  };

  const removeChannelFromDB = async (channelName) => {
    const response = await removeChannel(channelName);
    // if (response.ok)
    //   removeFriendSuccess = true;
    // else
    //   removeFriendSuccess = false;
  };

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));
    
    if (!user.value)
      window.location.href = "/";

    userName.value = user.value.displayName;
    adminImage = "src/assets/userImages/" + user.value.image;

    let friendsData = await getAllFriends(user.value.userName);
    friendsData.forEach(async (friend, index) => {
      let imagePath = "../assets/userImages/" + friend.image;
      await import(/* @vite-ignore */ imagePath).then((image) => {
        friendsData[index].imageSrc = image.default;
        console.log(image.default);
      });
    });

    friends.value.splice(0, friends.value.length, ...friendsData);
    channels.value.splice(0, channels.value.length, ...(await getAllChannels(user.value.userName)));
  });
</script>

<template>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css" rel="stylesheet" type="text/css" />
  <!--Stats-->
  <div class="stats shadow">
    <!--Username-->
    <div class="stat">
      <div class="stat-figure text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </div>
      <div class="stat-title">Username</div>
      <div class="stat-value">{{ userName }}</div>
    </div>
    <!--Games total-->
    <div class="stat">
      <div class="stat-figure text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </div>
      <div class="stat-title">Games Total</div>
      <div class="stat-value">0</div>
    </div>
    <!--Games won-->
    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div class="stat-title">Games won</div>
      <div class="stat-value">0</div>
    </div>
    <!--Username-->
    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div class="stat-title">Winrate</div>
      <div class="stat-value">0%</div>
    </div>
  </div>

  <div class="overflow-x-auto">
    <div class="grid-container">
      <!-- <div v-if="addFriendSuccess" class="toast toast-start">
        <div class="alert alert-success">
          <span>Friend added successfully.</span>
        </div>
      </div> -->
      <!-- Affiche le message en cas d'échec -->
      <!-- <div v-else class="toast toast-start">
        <div class="alert alert-error">
          <span>Failed to add friend.</span>
        </div>
      </div> -->
      <br>
      <div class="underStat">
        <form @submit.prevent="addFriendFromDB(userName, friendName)">
          <button class="btn btn-primary">Add Friend</button>
          <input type="text" id="friendName" v-model="friendName" class="input input-bordered w-full max-w-xs" />
        </form>
      </div>
      <br>
      <!--FriendList-->
      <div class="requestTable table-border">
        <table class="table">
          <caption>Friends</caption>
          <tbody>
            <tr v-for="(user, index) in friends" :key="index">
              <th>
                <label>
                  <input type="checkbox" class="checkbox" v-model="user.isChecked" />
                </label>
              </th>
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
                <router-link :to="'/profile/' + user.userName">
                  <button class="btn no-animation">{{ user.userName }}</button>
                </router-link>
              </td>
              <td>
                <!-- <div v-if="user.isChecked" class="profile"> -->
                  <button class="btn btn-error" @click="removeFriendFromDB(userName, user.userName)">Delete Friend</button>
                <!-- </div>
                <div v-else class="profile">
                  <button class="btn" @click="sendMessageFromFront">Visit Profile</button>
                </div> -->
              </td>
            <td> <button class="btn">Invite in a Game</button> </td>
            <td>
              <button class="btn" onclick="modalChannel.showModal()">Invite in Channel</button>
              <dialog id="modalChannel" class="modal modal-bottom sm:modal-middle">
                <div class="modal-box w-11/12 max-w-5xl">
                  <form class ="dialogModalChannel" method="dialog" @submit.prevent="createChannel(channelName, userName, user.userName)">
                    <input type="text" placeholder="Channel's name" v-model="channelName" class="input input-bordered input-sm w-full max-w-xs" /><br><br>
                    <button class="btn">Send Invitation</button>
                  </form>
                </div>
              </dialog>
            </td>
          </tr>
        </tbody>
        </table>
      </div>
      <br><br>
      <!--ChannelList-->
      <div class="requestTable table-border">
        <table class="table">
          <caption>Channels</caption>
          <tbody>
            <tr v-for="(channel, index) in channels" :key="index">
              <th>
                <label>
                  <input type="checkbox" class="checkbox" v-model="channel.isChecked" />
                </label>
              </th>
              <td>
                <label tabindex="0" class="btn btn-ghost btn-circle">
                  <div class="avatar">
                    <div class="w-24 mask mask-squircle">
                      <img :src="adminImage" />
                    </div>
                  </div>
                </label>
              </td>
              <td>
                <router-link :to="'/channel/' + channel.channelName">
                  <button class="btn no-animation">{{ channel.channelName }}</button>
                </router-link>
              </td>
              <td>
                <!-- <div v-if="user.isChecked" class="profile"> -->
                  <button class="btn btn-error" @click="removeChannelFromDB(channel.channelName)">Delete Channel</button>
                <!-- </div>
                <div v-else class="profile">
                  <button class="btn" @click="sendMessageFromFront">Visit Profile</button>
                </div> -->
              </td>
              <td>
              <button class="btn">Manage Channel</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
  .requestTable {
    max-height: 34vh;
    overflow-x: auto;
  }

  .requestTable::-webkit-scrollbar {
    width: 10px;
  }

  .requestTable::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  .requestTable::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .requestTable::-webkit-scrollbar-track {
    background: #ddd;
  }

  .dialogModalChannel { 
    text-align:center;
  }

  .rounded-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
  }

  .rounded-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .underStat {
    display: center;
    text-align: center;
  }

</style>