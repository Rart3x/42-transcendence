<script setup>
import { RouterLink, RouterView } from "vue-router";
import { onMounted, ref } from "vue";
import Cookies from "js-cookie";
import { getUserByCookie } from "./api/get.call.ts";

const userName = ref("");
let user = ref(null);

const logout = () => {
  // Clear userLogin cookie
  Cookies.remove("_authToken");
  // Redirect to sign-in page
  window.location.href = "/";
};

const signInWithIntra = () => {
  // Redirect the user to the 42 intra authorization page
  window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${
    import.meta.env.VITE_CLIENT_ID
  }&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=code`;
};

onMounted(async () => {
    if (Cookies.get("_authToken") == undefined)
      return;
    console.log(Cookies.get("_authToken"));
    user = await getUserByCookie(Cookies.get("_authToken"));
    userName.value = user.displayName;
  });

</script>

<template>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css" rel="stylesheet" type="text/css" />
    <header>
      <div class="Navbar-container">
        <ol class="Navbar-list">
          <li>
            <router-link to="/" class="Navbar-content">Home</router-link>
          </li>
          <li>
            <router-link to="/game" class="Navbar-content">Game</router-link>
          </li>
          <li>
            <router-link to="/about" class="Navbar-content">About</router-link>
          </li>
          <li>
            <router-link to="/chat" class="Navbar-content">Chat</router-link>
          </li>
        </ol>
        <div v-if="userName" class="profile">
          <router-link to="/profile" class="Navbar-profile">
            Logged in as: {{ userName }}
          </router-link>
          <button @click="logout">Logout</button>
        </div>
        <div v-else class="profile">
          <img
            src="@/components/icons/SignIn.png"
            @click="signInWithIntra"
            class="sign"
          />
        </div>
      </div>
    </header>
</template>

<style scoped>
@import url(https://fonts.googleapis.com/css2?family=Silkscreen&display=swap);

.sign {
  width: 128;
  height: 32px;
  justify-self: flex-start;
  border-radius: 10px;
}
.Navbar-container {
  border-radius: 10px;
  border-color: #313628;
  background-color: #7b5190;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1vh 6vw 1vh 6vw;
  margin: 1vh 1vw 1vh 1vw;
}
.Navbar-list {
  display: flex;
  list-style-type: none;
}

.Navbar-content {
  color: #fff;
  padding: 0vh 0.5vw 0vh 0vw;
  font-family: "Silkscreen", sans-serif;
  text-decoration: none;
}

.profile {
  display: flex;
  gap: 5px;
}
.Navbar-profile {
  font-size: 12px;
  color: #fff;
  font-family: "Silkscreen", sans-serif;
  text-decoration: none;
}

@media (min-width: 1024px) {
  .Navbar_container {
    gap: 5vw;
  }
  .Navbar-content {
    padding: 1vh 4vw 1vh 4vw;
  }
}
</style>
