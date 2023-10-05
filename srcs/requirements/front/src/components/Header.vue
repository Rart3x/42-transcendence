<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="Navbar_container">
      <ol class="Navbar_list">
        <li>
          <router-link to="/" class="Navbar_content">
            <h3>PMT</h3>
          </router-link>
        </li>
      </ol>
    </div>
  </header>
</template>

<style scoped>
.Navbar_container {
  border-radius: 10px;
  display: flex;
  padding: 2vh 4vw 2vh 4vw;
  margin: 1vh 1vw 1vh 1vw;
  background-color: #7b5190;
}

.Navbar_list {
  display: flex;
  list-style-type: none;
  text-align: center;
  padding: 0vh 40vw 0vh 43.5vw;
}

.Navbar_content {
  color: #fff;
  text-decoration: none;
  font-size: 20px;
}
</style>
