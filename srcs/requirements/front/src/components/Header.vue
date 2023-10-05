<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="Navbar_container">
      <ol class="Navbar_list">
        <li>
          <router-link to="/" class="Navbar_content"> PMT </router-link>
        </li>
      </ol>
    </div>
  </header>
</template>

<style scoped>
.Navbar_container {
  border-radius: 10px;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2vh 4vw 2vh 4vw;
  margin: 1vh 0vw 1vh 0vw;
  /* background-image: url(); */
  background-color: #ffffff;
}

.Navbar_list {
  display: flex;
  list-style-type: none;
  text-align: center;
}

.Navbar_content {
  color: #595358;
  padding: 0vh 0vw 0vh 0vw;
  text-decoration: none;
  font-size: 20px;
}
</style>
