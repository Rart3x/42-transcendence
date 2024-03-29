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
          const imagePromises = this.users.map(async (user, index) => {
            let imagePath = await getImage(user.image);
            return imagePath;
          });
          this.userImages = await Promise.all(imagePromises);
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
  <div class="overflow-x-auto min-h-[calc(100vh-206px)] bg-base-200">
    <div v-for="(item,index) in users" :key="item">
      <div class="stats shadow flex flex-row" :class="{ 'gold': index === 0, 'silver': index === 1, 'bronze': index === 2 }">
        <div v-if="item" class="stat"> 
          <div class="stat-title"> Rank </div>
          <div class="stat-value">{{ index + 1 }}</div>
        </div>
        <div class="stat grid grid-col-2">
          <div class="grid col-start-1">
            <div class="stat-title"> Username </div>
            <div class="stat-value"> {{ item.userName }} </div>
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
          <div class="stat-title"> Victories </div>
          <div class="stat-value"> {{ item.gameWon + " / " + item.gamePlayed }} </div>
        </div>
        <div v-if="item" class="stat">
          <div class="stat-title"> Winrate </div>
          <div v-if="item.gamePlayed != 0" class="stat-value">
            <div v-if="((item.gameWon / item.gamePlayed) * 100).toFixed(0) >= 50" class="stat-value text-green-500"> {{ ((item.gameWon / item.gamePlayed) * 100).toFixed(2) }} % </div>
            <div v-if="((item.gameWon / item.gamePlayed) * 100).toFixed(0) < 50 && ((item.gameWon / item.gamePlayed) * 100).toFixed(0) >= 30" class="stat-value text-yellow-500"> {{ ((item.gameWon / item.gamePlayed) * 100).toFixed(2) }} % </div>
            <div v-if="((item.gameWon / item.gamePlayed) * 100).toFixed(0) < 30" class="stat-value text-red-500"> {{ ((item.gameWon / item.gamePlayed) * 100).toFixed(2) }} % </div>
          </div>
          <div v-else class="stat-value">N/A</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .stats { border-radius: unset; }

  .gold { background-color: #4169E1; }
  .silver { background-color: #6495ED; }
  .bronze { background-color: #87CEEB; }
</style>