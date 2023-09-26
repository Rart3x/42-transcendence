<script setup>
  import { ref } from "vue";
  import axios from "axios";

  const signInWithIntra = () => {
    const clientId = "u-s4t2ud-5833d46d67a995441fda6e0c4b881ac422f2c60fef135dab669407aa0f9fcbc4";
    const clientSecret = "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";
    const redirectUri = "http://localhost:5173/profile";

    // Step 1: Redirect the user to the 42 intra authorization page
    window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

    // Step 3: Extract the authorization code from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // Step 4: Exchange the authorization code for an access token
    const getToken = async () => {
      try {
        const response = await axios.post("https://api.intra.42.fr/oauth/token", {
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: redirectUri
        });
        const accessToken = response.data.access_token;

        // Step 5: Use the access token to make authenticated requests
        const userResponse = await axios.get("https://api.intra.42.fr/v2/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const user = userResponse.data;

        // Store the user information or perform any other actions
        console.log(user);
      } catch (error) {
        console.error(error);
      }
    };

    getToken();
  };
</script>

<template>
  <body class="body">
    <div>
      <button @click="signInWithIntra">Sign in with intra</button>
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
