<script setup>
  import { ref } from "vue";
  import { updateUsername } from './api/ApiCalls';

  const userName = ref("");
  const newUserName = ref("");
</script>

<template>
  <br>
  <div id="userForm">
    <form @submit.prevent="updateUsername(userName, newUserName)">
      <input type="text" id="userName" v-model="userName">
      <input type="text" id="newUserName" v-model="newUserName">
      <br>
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<style scoped>

#userForm {
  text-align: center;
}

</style>