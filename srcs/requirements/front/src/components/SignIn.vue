<script setup>
import { ref, onMounted } from "vue";
import Cookies from 'js-cookie';
import axios from "axios";

const userInfo = ref(null);

const code = new URL(window.location.href).searchParams.get("code");

onMounted(async () => {
  if (code) {
    // Step 2: Exchange the authorization code for an access token
    try {
      const response = await axios.post("https://api.intra.42.fr/oauth/token", {
        grant_type: "authorization_code",
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
        code: code,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI
      });
      const accessToken = response.data.access_token;

      // Step 3: Use the access token to make authenticated requests
      const userResponse = await axios.get("https://api.intra.42.fr/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const user = userResponse.data;

      // Step 4: Store the user information in the userInfo object
      userInfo.value = user;
      Cookies.set('userLogin', user.login, { expires: 1, secure: true, sameSite: 'Strict' });
    } catch (error) {
      console.error(error);
    }
    console.log(userInfo._rawValue);
  }
});

const signInWithIntra = () => {
  // Step 1: Redirect the user to the 42 intra authorization page
  window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=code`;
};
</script>


<template>
  <body class="body">
    <div>
      <div v-if="userInfo">
        <img
          :src="userInfo.image.versions.medium"
          :alt="userInfo.email"
        />
        <h2 v-if="userInfo.location" >
          Welcome, {{ userInfo.displayname }} ({{ userInfo.login }}) [{{ userInfo.location }}]
        </h2>
        <h2 v-else>
          Welcome, {{ userInfo.displayname }}
        </h2>
      </div>
      <div v-else>
        <button @click="signInWithIntra">Sign in with intra</button>
      </div>
    </div>
  </body>
</template>

<style scoped>
.body {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
