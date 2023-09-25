<script setup>
import { ref } from "vue";

let id = 0;

const newName = ref("");
const newPass = ref("");

const name = ref([]);
const pass = ref([]);

function addUser() {
  addName();
  addPass();
}

function addName() {
  name.value.push({ id: id++, text: newName.value });
  newName.value = "";
}

function addPass() {
  pass.value.push({ id: id++, text: newPass.value });
  newPass.value = "";
}

function removeItem(item) {
  name.value = name.value.filter((t) => t !== item);
  pass.value = pass.value.filter((t) => t !== item);
}
</script>

<template>
  <body class="body">
    <div>
      <form @submit.prevent="addUser">
        <ol class="list_container">
          <li>
            <ul class="list">
              <li>
                <h1>Sign In</h1>
              </li>
              <li>
                <label for="name">Name : </label>
              </li>
              <li>
                <input v-model="newName" required minlength="1" />
              </li>
              <li>
                <label for="name">Password : </label>
              </li>
              <li>
                <input v-model="newPass" required minlength="1" />
              </li>
              <li>
                <button>Log In</button>
              </li>
            </ul>
          </li>
          <li>
            <ul class="list">
              <li>
                <h1>Sign with 42 api</h1>
              </li>
            </ul>
          </li>
        </ol>
      </form>
      <ul>
        <li v-for="item in name" :key="item.id">
          {{ item.text }}
          <button @click="removeItem(item)">X</button>
        </li>
        <li v-for="item in pass" :key="item.id">
          {{ item.text }}
          <button @click="removeItem(item)">X</button>
        </li>
      </ul>
    </div>
  </body>
</template>

<style scoped>
.body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.list_container {
  display: flex;
  flex-direction: row;
  gap: 10vw;
  list-style: none;
}
.list {
  list-style: none;
}
@media (min-width: 1024px) {
  .list_container {
    gap: 10vw;
  }
}
</style>
