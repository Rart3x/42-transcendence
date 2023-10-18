<script setup>
import { getMessage} from "./api/get.call";
import { insertMessage } from "./api/post.call";
import { ref, onMounted } from "vue";

const message_text = ref("");
const messages = ref([]);

onMounted(async () => {
  await loadMessages();
});

const formatMessageDate = (dateString) => {
  const options = { hour: 'numeric', minute: 'numeric' };
  return new Date(dateString).toLocaleString('en-US', options);
};

const loadMessages = async () => {
  try {
    const response = await getMessage();
    if (response && response.length > 0) {
      messages.value = response;
    }
  } 
  catch (error) {
    console.error("error: fetching messages:", error);
  }
};

const sendMessage = async () => {
  try {
    await insertMessage(message_text.value);
    const newMessage = await getMessage();
    if (newMessage) {
      messages.value.push(newMessage);
    }
    message_text.value = "";
  } 
  catch (error) {
    console.error("error: sending message:", error);
  }
};
</script>

<template>
  <div class="chat-container">
    <div class="chat-box">
      <!-- <span class="scroll-start-at-top"></span> -->
      <div class="chat-header">Chat</div>
      <div class="chat-messages">
        <ul>
          <li v-for="message in messages" :key="message.id">
            <div class="message">
              <div class="message-text">{{ message.message_text }}</div>
              <div class="message-date">{{ formatMessageDate(message.message_date) }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input id="message_text" class="chat-input" v-model="message_text" placeholder="Type your message..." />
      <button type="submit" class="chat-button">Send</button>
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
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
}

.scroll-start-at-top {
  flex: 1 1 0%;
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
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
}

.message {
  margin: 10px 0;
}

.message-text {
  font-weight: bold;
}

.message-date {
  font-size: 12px;
  color: #888;
}
</style>