<script setup>
import { getMessage } from "./api/get.call";
import { insertMessage } from "./api/post.call";
import { ref, onMounted } from "vue";
import { nextTick } from "vue";

const message_text = ref("");
const messages = ref([]);

onMounted(async () => {
  await loadMessages();
  scrollToBottom();
});

const formatMessageDate = (dateString) => {
  const options = { hour: "numeric", minute: "numeric" };
  return new Date(dateString).toLocaleString("en-US", options);
};

const loadMessages = async () => {
  try {
    const response = await getMessage();
    if (response && response.length > 0) {
      messages.value = response;
    }
  } catch (error) {
    console.error("error: fetching messages:", error);
  }
};

const scrollToBottom = () => {
  const container = document.querySelector(".chat-messages");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

const sendMessage = async () => {
  try {
    await insertMessage(message_text.value);

    await nextTick();

    messages.value = await getMessage();

    await nextTick();
    scrollToBottom();

    message_text.value = "";
  } catch (error) {
    console.error("error: sending message:", error);
  }
};
</script>

<template>
  <div class="chat-container">
    <div class="chat-box">
      <div class="chat-messages" ref="messageContainer">
        <ul>
          <li v-for="message in messages" :key="message.id">
            <div class="message">
              <div class="message-text">{{ message.message_text }}</div>
              <div class="message-date">
                {{ formatMessageDate(message.message_date) }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="chat-header">Chat</div>
    </div>
    <form @submit.prevent="sendMessage">
      <input
        id="message_text"
        class="chat-input"
        v-model="message_text"
        placeholder="Type your message..."
      />
      <button type="submit" class="chat-button" @click="reloadWindow">
        Send
      </button>
    </form>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}

.chat-box {
  width: 400px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column-reverse;
}

.chat-header {
  font-size: 20px;
  text-align: center;
  margin-bottom: 10px;
}

.chat-messages {
  max-height: 400px;
  overflow-y: auto;
}

.chat-input {
  width: 100%;
  padding: 5px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.chat-button {
  width: 100%;
  margin-top: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
}

.message {
  margin: 10px;
}

.message-text {
  font-weight: bold;
}

.message-date {
  font-size: 12px;
  color: #888;
}
</style>
