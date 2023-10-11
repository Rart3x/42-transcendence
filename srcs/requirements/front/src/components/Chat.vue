<script setup>
  import { ref } from "vue";
  import { insertMessage } from './api/ApiCalls';
</script>

<template>
  <br>
  <div id="messageForm">
    <form @submit.prevent="insertMessage(message_text)">
      <textarea id="message_text"></textarea>
      <br>
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<style scoped>

#messageForm {
  text-align: center;
}

</style>