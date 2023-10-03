<script setup>
import { RouterLink, RouterView } from "vue-router";
import Cookies from 'js-cookie';

const logout = () => {
  // Clear userLogin cookie
  Cookies.remove('userLogin');
  // Redirect to sign-in page
  this.$router.push('/sign-in');
};
</script>

<template>
  <header>
    <div class="Navbar_container">
      <router-link to="/" class="Navbar_content">
        <img src="@/components/images/icon-pmt.png" class="icon" />
      </router-link>
      <ol class="Navbar_list">
        <li>
          <router-link to="/" class="Navbar_content"> Home </router-link>
        </li>
        <li>
          <router-link to="/game" class="Navbar_content"> Game </router-link>
        </li>
        <li>
          <router-link to="/about" class="Navbar_content"> About </router-link>
        </li>
        <li>
          <router-link to="/chat" class="Navbar_content"> Chat </router-link>
        </li>
        <li>
          <router-link to="/user" class="Navbar_content"> Create User </router-link>
        </li>
      </ol>
      <div v-if="Cookies.get('userLogin')">
        Logged in as: {{ Cookies.get('userLogin') }}
          <button @click="logout">Logout</button>
      </div>
      <div v-else>
        <router-link to="/sign-in" class="Navbar_content"> Sign In </router-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
.icon {
  width: 32px;
  height: 32px;
  justify-self: flex-start;
  border-radius: 10px;
}
.Navbar_container {
  border-radius: 10px;
  border-color: #313628;
  background-color: #a4ac96;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1vh;
  margin: 0vh 1vw 0vh 1vw;
}
.Navbar_icon {
  display: flex;
  border-style: dotted;
}

.Navbar_list {
  display: flex;
  list-style-type: none;
  text-align: center;
}

.Navbar_content {
  color: #595358;
  padding: 0.9vh 4vw 0.9vh 4vw;
}

@media (min-width: 1024px) {
  .Navbar_container {
    gap: 10vw;
  }
}
</style>
