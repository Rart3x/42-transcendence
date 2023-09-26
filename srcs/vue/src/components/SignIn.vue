<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const clientId = "u-s4t2ud-5833d46d67a995441fda6e0c4b881ac422f2c60fef135dab669407aa0f9fcbc4";
const clientSecret = "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";
const redirectUri = "http://localhost:5173/sign-in";

const userInfo = ref(null);

const code = new URL(window.location.href).searchParams.get("code");

onMounted(async () => {
  if (code) {
    // Step 2: Exchange the authorization code for an access token
    try {
      const response = await axios.post("https://api.intra.42.fr/oauth/token", {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
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
    } catch (error) {
      console.error(error);
    }
    console.log(userInfo._rawValue);
  }
});

const signInWithIntra = () => {
  // Step 1: Redirect the user to the 42 intra authorization page
  window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
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
