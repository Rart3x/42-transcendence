<script setup>
import Header from "@/components/Header.vue";
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div id="userForm">
    <form @submit.prevent="submitForm">
      <label for="username">Username :</label>
      <input type="text" id="username" v-model="userData.userName" required>
      <button type="submit">Envoyer</button>
    </form>
  </div>
</template>

  
<script>
export default {
  data() {
    return {
      userData: {
        userName: '',
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName: this.userData.userName }),
        });

        if (response.ok) {
          const responseData = await response.json();
        }
        else {
          console.error('error: ', response.status);
        }
      }
      catch (error) {
        console.error('error: sending POST request :', error);
      }
    },
  },
};
</script>

<style scoped>
#userForm {
    text-align:center;
}
</style>