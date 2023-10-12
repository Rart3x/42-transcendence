<script setup>
import { RouterLink, RouterView } from "vue-router";
import Cookies from "js-cookie";

const logout = () => {
  // Clear userLogin cookie
  Cookies.remove("userLogin");
  // Redirect to sign-in page
  window.location.href = "/";
};

const signInWithIntra = () => {
  // Redirect the user to the 42 intra authorization page
  window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${
    import.meta.env.VITE_CLIENT_ID
  }&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=code`;
};
</script>

<template>
  <header>
    <div class="Navbar_container">
      <ol class="Navbar_list">
        <li>
          <router-link to="/" class="Navbar_content">Home</router-link>
        </li>
        <li>
          <router-link to="/game" class="Navbar_content">Game</router-link>
        </li>
        <li>
          <router-link to="/about" class="Navbar_content">About</router-link>
        </li>
        <li>
          <router-link to="/chat" class="Navbar_content">Chat</router-link>
        </li>
      </ol>
      <div v-if="Cookies.get('userLogin')">
        Logged in as: {{ Cookies.get("userLogin") }}
        <button @click="logout">Logout</button>
      </div>
      <div v-else>
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
.Navbar_container {
  border-radius: 10px;
  border-color: #313628;
  background-color: #7b5190;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1vh 6vw 1vh 6vw;
  margin: 1vh 1vw 1vh 1vw;
}
.Navbar_list {
  display: flex;
  list-style-type: none;
  text-align: center;
}

.Navbar_content {
  color: #fff;
  padding: 0vh 0.5vw 0vh 0vw;
  font-family: "Silkscreen", sans-serif;
  text-decoration: none;
}

@media (min-width: 1024px) {
  .Navbar_container {
    gap: 5vw;
  }
  .Navbar_content {
    padding: 1vh 4vw 1vh 4vw;
  }
}
</style>
