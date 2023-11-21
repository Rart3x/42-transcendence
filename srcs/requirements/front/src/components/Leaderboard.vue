
<script>
import { onMounted, ref } from "vue";
import { getAllUsers } from "./api/get.call";
import About from './About.vue';

export default {
  components: { About },
  setup() {
    let users = ref([]);
    let userImage = ref([]);
    
    onMounted(async () => {
        users.value = await getAllUsers();
        users.value = users.value.sort((a, b) => b.matchmakingScore - a.matchmakingScore)
        users.value.forEach((user, index) => {
          let imagePath = "../assets/userImages/" + user.image;
          import(/* @vite-ignore */ imagePath).then((image) => {
            userImage.value.push(image.default);
          });
        })
    })

   return {
     users,
     userImage
   };
  },
};

</script>

<template>
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
            <img :src=userImage[index] alt="logo"/>
          </div>
          </div>
        </div>
        </div>
        <div class="stat">
          <div class="stat-title"> Games Total </div>
          <div class="stat-value"> {{ user.gamePlayed }} </div>
        </div>
         <div class="stat">
          <div class="stat-title"> Games won </div>
          <div class="stat-value"> {{ user.gameWon }} </div>
        </div>
        <div class="stat">
          <div class="stat-title"> Winrate </div>
          <div v-if="user.gamePlayed != 0" class="stat-value"> {{ (user.gameWon / user.gamePlayed) * 100}}  % </div>
          <div v-else class="stat-value">{{ 100 }} % </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
</style>
