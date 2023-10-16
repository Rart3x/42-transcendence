<script setup>
import { insertMessage } from "./api/ApiCalls";
import { ref } from "vue";

let id = 0;

const newTodo = ref("");
const todos = ref([{ id: id++, text: "Welcome." }]);

function addTodo() {
  todos.value.push({ id: id++, text: newTodo.value });
  newTodo.value = "";
}
</script>

<template>
  <body>
    <div class="chat-container">
      <div class="chat-box">
        <span class="scroll-start-at-top"></span>
        <div id="scroll-container">
          <ul class="chat-list">
            <li v-for="todo in todos" :key="todo.id">
              {{ todo.text }}
            </li>
          </ul>
        </div>
      </div>
      <form @submit.prevent="addTodo">
        <input class="chat-msg" v-model="newTodo" minlength="1" />
        <button type="submit" class="chat-button">Send</button>
      </form>
    </div>
  </body>
</template>

<style scoped>
body {
  min-width: 90vw;
  min-height: 91.9vh;
}
.chat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1 1 0%;
}
.chat-box {
  width: 75vw;
  height: 80vh;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
  background-color: #fff;
}

.scroll-start-at-top {
  flex: 1 1 0%;
}
.chat-list {
  background-color: #fff;
  color: black;
  list-style: none;
}

.chat-msg {
  width: 70.1vw;
  min-height: 30px;
}
.chat-button {
  min-height: 30px;
  width: 5vw;
}
</style>
