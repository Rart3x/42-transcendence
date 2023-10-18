<script setup>
  import { ref } from "vue";
  import { updateUsername } from './api/post.call.ts';
  import Cookies from "js-cookie";

  const newUserName = ref("");
  let userName = Cookies.get("userLogin");

  const handleSubmit = async () => {
    const userName = Cookies.get("userLogin");
    await updateUsername(userName, newUserName.value);
    Cookies.remove("userLogin");
    Cookies.set("userLogin", newUserName.value);
    window.location.href = "/Profile";
  }
</script>

<template>
  <div id="userForm">
    <form @submit.prevent="handleSubmit">
      <label for="newUserName">New username:</label>
      <br>
      
      <input type="text" id="newUserName" v-model="newUserName" :placeholder="userName">
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<style scoped>

#userForm {
  text-align: center;
}

</style>