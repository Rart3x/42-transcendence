<script setup>
  import Alert from './Alert.vue';
  import UserStatHeader from "./UserStatHeader.vue";
  import History from "./History.vue";
  import Cookies from "js-cookie";
  import { ref, onMounted } from 'vue';
  import {  getUserByCookie, } from './api/get.call';
  import { useRoute } from 'vue-router';

  let user = ref(null);

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));
});

</script>

<template>
    <UserStatHeader v-if="user"
        :userName="user.userName"
        :gamePlayed="user.gamePlayed"
        :gameWon="user.gameWon"
    />
    <History v-if="user" :userName="user.userName"/>
</template>
