<script setup>
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";

import Header from "@/components/Header.vue";
</script>

<template>
  <h1 class="item">About us</h1>
  <div class="container">
    <ol class="list_container">
      <img src="@/components/images/kramjatt.jpg" class="profile_picture" />
      <ul class="information">
        <li>
          <p>Login: Kramjatt</p>
        </li>
        <li>
          <p>Role: Back-end</p>
        </li>
        <li>
          <p>Explanation: TODO</p>
        </li>
        <li>
          <p>Personal note:</p>
        </li>
      </ul>
    </ol>
    <ol class="list_container">
      <img src="@/components/images/fsanna.jpg" class="profile_picture" />
      <ul class="information">
        <li>
          <p>Login: Fsanna</p>
        </li>
        <li>
          <p>Role: User management</p>
        </li>
        <li>
          <p>Explanation: TODO</p>
        </li>
        <li>
          <p>Personal note:</p>
        </li>
      </ul>
    </ol>
    <ol class="list_container">
      <img src="@/components/images/dguillau.jpg" class="profile_picture" />
      <ul class="information">
        <li>
          <p>Login: Dguillau</p>
        </li>
        <li>
          <p>Role: Game developer</p>
        </li>
        <li>
          <p>Explanation: TODO</p>
        </li>
        <li>
          <p>Personal note:</p>
        </li>
      </ul>
    </ol>
    <ol class="list_container">
      <img src="@/components/images/nicarpen.jpg" class="profile_picture" />
      <ul class="information">
        <li>
          <p>Login: Nicarpen</p>
        </li>
        <li>
          <p>Role: Front-end</p>
        </li>
        <li>
          <p>Explanation: TODO</p>
        </li>
        <li>
          <p>Personal note:</p>
        </li>
      </ul>
    </ol>
  </div>
</template>

<<<<<<< HEAD
<style scoped>
.item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2vh;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 5vh;
}

.list_container {
  display: flex;
  gap: 5vw;
}

.profile_picture {
  width: 20vw;
}
.information {
  list-style-type: none;
}
</style>
=======
<style scoped></style>
>>>>>>> main
