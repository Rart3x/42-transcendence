<script setup>
import Cookies from "js-cookie";
import { ref, onMounted } from "vue";
import { User } from "@components/User.vue";

const userInfo = ref(null);

const code = new URL(window.location.href).searchParams.get("code");

onMounted(async () => {
  if (code || Cookies.get("userLogin")) {
    try {
      const response = await fetch("https://api.intra.42.fr/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: import.meta.env.VITE_CLIENT_ID,
          client_secret: import.meta.env.VITE_CLIENT_SECRET,
          code: code,
          redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const accessToken = data.access_token;

      const userResponse = await fetch("https://api.intra.42.fr/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }
      
      const user = await userResponse.json();

      userInfo.value = user;
      Cookies.set("userLogin", user.login, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });

      const userComponent = new User();
      userComponent.submitForm(user.login);
    }
    catch (error) {
      console.error(error);
    }
    console.log(userInfo._rawValue);
    window.location.href = "/Profile";
  }
  else {
    window.location.href = "/";
  }
});
</script>
