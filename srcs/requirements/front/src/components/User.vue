<script setup>
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";

import Header from "@/components/Header.vue";
</script>

<template>
    <div id="userForm">
        <form @submit.prevent="submitForm">
            <label for="username">Username :</label>
            <input type="text" id="username" v-model="userData.username" required>
        
            <label for="email">Password :</label>
            <input type="password" id="password" v-model="userData.password" required>
        
            <button type="submit">Envoyer</button>
        </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userData: {
          username: '',
          password: '',
        },
      };
    },
    methods: {
      async submitForm() {
        try {
          const response = await axios.post('/api/users', this.userData);

        } catch (error) {
          console.error('Erreur lors de l\'envoi de la requête POST :', error);
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