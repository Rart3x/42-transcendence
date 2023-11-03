<script setup>
  import Cookies from "js-cookie";
  import { onMounted, ref } from "vue";
  import { getAllChannels, getAllFriends, getUserByCookie } from "./api/get.call";
  import { addFriend, createChannel, removeFriend } from './api/post.call';

  const friendName = ref("");
//   const showModalChannel = ref(false);
  const userName = ref("");

  let channels = ref([]);
  let friends = ref([]);
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

  const sendMessageFromFront = () => {
    console.log("sendMessageFromFront");    
  };

  onMounted(async () => {
    user = await getUserByCookie(Cookies.get("_authToken"));
    if (!user)
      window.location.href = "/";
    userName.value = user.displayName;

    friends = await getAllFriends(user.userName);
    channels = await getAllChannels(user.userName);

    for (user of friends.value) {
      const imagePath = `../assets/userImages/${user.image}`;
      import(/* @vite-ignore */ imagePath).then((image) => {
        user.image = image.default;
      });
    }
  });

</script>

<template>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css" rel="stylesheet" type="text/css" />
  <!--Stats-->
  <div class="stats shadow">
    <div class="stat">
      <div class="stat-figure text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </div>
      <div class="stat-title">Username</div>
      <div class="stat-value text-primary">{{ userName }}</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </div>
      <div class="stat-title">Games Total</div>
      <div class="stat-value text-primary">0</div>
    </div>
    
    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div class="stat-title">Games won</div>
      <div class="stat-value text-secondary">0</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div class="stat-title">Winrate</div>
      <div class="stat-value text-secondary">0%</div>
    </div>
  </div>

  <!--Friends List -->
  <div class="overflow-x-auto">
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
    <div class="addingFriend">
      <form @submit.prevent="addFriendFromDB(userName, friendName)">
        <button class="btn btn-primary">Add Friend</button>
        <input type="text" id="friendName" v-model="friendName" class="input input-bordered w-full max-w-xs" />
      </form>
    </div>
    <div class="showChannels">
      <label tabindex="0" class="btn m-1">Channels</label>
      <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li v-for="(channel, index) in channels" :key="index">
          <router-link :to="'/channel/' + channel.channelName">{{ channel.channelName }}</router-link>
        </li>
      </ul>
    </div>
    <table class="table">
      <thead>
      </thead>
      <tbody>
        <br><tr></tr>
        <tr v-for="(user, index) in friends" :key="index"> <!--style="background-color: blue;"-->
          <th>
            <label>
              <input type="checkbox" class="checkbox" v-model="user.isChecked" />
            </label>
          </th>
          <td>
            <div class="flex items-center space-x-3">
              <div class="rounded-image">
                <img :src="'../assets/' + user.image" alt="User Image" />
              </div>
            </div>
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
        <td>
          <button class="btn">Invite in Game</button>
        </td>
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
</template>

<style>
.addingFriend {
  text-align: center;
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
</style>