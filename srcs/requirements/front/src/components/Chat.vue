<script setup>
import { ref } from "vue";
import { insertMessage } from "./api/ApiCalls";
</script>

<template>
  <body>
    <div class="chat-container">
      <canvas class="chat-box"></canvas>
      <form @submit.prevent="insertMessage(message_text)">
        <input class="chat-msg" />
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
}
.chat-box {
  background-color: #fff;
  width: 75vw;
  min-height: 80vh;
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
