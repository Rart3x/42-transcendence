<script setup>
  import Cookies from "js-cookie";
  import { onMounted, ref } from "vue";
  import { getUserByCookie } from "./api/get.call";
  import { addFriend, updateUsername } from './api/post.call';

  const newUserName = ref("");
  const friendName = ref("");
  const userName = ref("");
  let user = ref(null);

  const handleSubmit = async () => {
    await updateUsername(user.userName, newUserName.value);
    window.location.href = "/Profile";
  }

  onMounted(async () => {
    user = await getUserByCookie(Cookies.get("_authToken"));
    userName.value = user.userName;
  });

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
    <dt>
      <div id="addFriend">
        <form @submit.prevent="addFriend('kramjatt', friendName)">
        <label for="friendName">friendName:</label>
        <br>
        <input type="text" id="friendName" v-model="friendName">
        <button type="submit">Send</button>
      </form>
      </div>
    </dt>
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

#addFriend {
  background-color: #7b5190; /* Couleur de fond du formulaire */
  border: 1px solid #ddd; /* Bordure du formulaire */
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
}

#addFriend form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

#addFriend label {
  width: 100%;
  font-weight: bold;
}

#addFriend input[type="text"] {
  width: 70%;
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

#addFriend button[type="submit"] {
  background-color: #007BFF; /* Couleur de fond du bouton */
  color: #fff; /* Couleur du texte du bouton */
  padding: 8px 16px; /* Espacement intérieur */
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>