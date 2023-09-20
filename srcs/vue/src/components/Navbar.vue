<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="Navbar_container">
    <img src="@/components/icons/icon-pmt.png" class="icon" />
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
        <router-link to="/profile" class="Navbar_content">
          Profile
        </router-link>
      </li>
    </ol>
    <a href="https://intra.42.fr" class="Navbar_content">Sign in </a>
  </div>
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
  margin: 0vh 2vw 0vh 2vw;
  gap: 10vw;
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
</style>
