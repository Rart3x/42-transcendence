<script setup>
  import Cookies from "js-cookie";
  import { ref } from "vue";
  // import { getUserFriend } from "./api/get.call";
  import { updateUsername } from './api/post.call';

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
  <br>
  <dl class="container">
    <dt>A</dt>
      <dd>Mekouyanski</dd>
    <dt>B</dt>
      <dd>Mes couilles en ski</dd>
    <dt>C</dt>
    <dt>D</dt>
    <dt>E</dt>
    <dt>F</dt>
    <dt>G</dt>
    <dt>H</dt>
    <dt>I</dt>
    <dt>J</dt>
    <dt>K</dt>
    <dt>L</dt>
    <dt>M</dt>
    <dt>N</dt>
    <dt>O</dt>
    <dt>P</dt>
    <dt>Q</dt>
    <dt>R</dt>
    <dt>S</dt>
    <dt>T</dt>
    <dt>U</dt>
    <dt>V</dt>
    <dt>W</dt>
    <dt>X</dt>
    <dt>Y</dt>
    <dt>Z</dt>
  </dl>
</template>

<style scoped>
#userForm {
  text-align: center;
}

.container {
  position: relative;
  width: 30%;
  height: 400px;
  overflow-y: auto;
  border: 1px solid white;
}

.container dt {
  position: sticky;
  color: white;
  padding: 8px 16px;
  text-transform: uppercase;
  font-weight: bold;
}

.container dd {
  margin: 0;
  padding: 8px;
  border-bottom: 1px solid #ccc;
}

</style>