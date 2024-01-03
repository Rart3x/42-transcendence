<script>
  import UserStatHeader from "./UserStatHeader.vue";
  import { onMounted, ref } from "vue";
  import { getAllUsers, getUserByUserId, getImage } from "./api/get.call";
  import Cookies from "js-cookie";

  export default {
    name: 'Leaderboard',
    components: {
      UserStatHeader
    },
    data(){
      return {
        users: [],
        userImages: [],
        user: null,
        cookieJWT: null
      }
    },
    async mounted(){
      const cookieUserId = Cookies.get('UserId');
      this.cookieJWT = Cookies.get('Bearer');
      if (typeof cookieUserId !== 'undefined' && typeof this.cookieJWT !== 'undefined'){
        this.user = await getUserByUserId(cookieUserId, this.cookieJWT);
        this.users = await getAllUsers(this.cookieJWT);
        this.users = this.users.sort((a, b) => b.matchmakingScore - a.matchmakingScore);
        if (this.users){
          this.users.forEach(async (user, index) => {
            let imagePath = await getImage(user.image);
            this.userImages.push(imagePath);
          })
        }
      }
    }
  }
</script>

<template>
  <UserStatHeader v-if="user"
    :userName="user.userName"
    :gamePlayed="user.gamePlayed"
    :gameWon="user.gameWon"
  />
  <div class="overflow-x-auto min-h-screen bg-base-200">
    <div v-for="(user,index) in users" :key="user">
      <div class="stats shadow flex flex-row">
        <div class="stat">
          <div class="stat-title"> Rank </div>
          <div v-if="user" class="stat-value"> {{ index + 1 }} </div>
        </div>
        <div class="stat grid grid-col-2">
          <div class="grid col-start-1">
            <div class="stat-title"> Username </div>
            <div class="stat-value"> {{ user.userName }} </div>
          </div>
          <div class="grid col-start-2">
            <div class="avatar">
          <div class="w-24 rounded-full">
            <img :src=userImages[index] alt="logo"/>
          </div>
          </div>
        </div>
        </div>
        <div v-if="user" class="stat">
          <div class="stat-title"> Games Total </div>
          <div class="stat-value"> {{ user.gamePlayed }} </div>
        </div>
        <div v-if="user" class="stat">
          <div class="stat-title"> Games won </div>
          <div class="stat-value"> {{ user.gameWon }} </div>
        </div>
        <div v-if="user" class="stat">
          <div class="stat-title"> Winrate </div>
          <div v-if="user.gamePlayed != 0" class="stat-value">
            <div v-if="((user.gameWon / user.gamePlayed) * 100).toFixed(0) >= 50" class="stat-value text-green-500"> {{ ((user.gameWon / user.gamePlayed) * 100).toFixed(2) }} % </div>
            <div v-if="((user.gameWon / user.gamePlayed) * 100).toFixed(0) < 50 && ((user.gameWon / user.gamePlayed) * 100).toFixed(0) >= 30" class="stat-value text-yellow-500"> {{ ((user.gameWon / user.gamePlayed) * 100).toFixed(2) }} % </div>
            <div v-if="((user.gameWon / user.gamePlayed) * 100).toFixed(0) < 30" class="stat-value text-red-500"> {{ ((user.gameWon / user.gamePlayed) * 100).toFixed(2) }} % </div>
          </div>
          <div v-else class="stat-value text-green-500">{{ 100 }} % </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .stats { border-radius: unset; }
</style>