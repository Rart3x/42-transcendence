<script setup>
import { ref, onMounted } from "vue";
import Cookies from 'js-cookie';
import axios from "axios";

const userInfo = ref(null);

const code = new URL(window.location.href).searchParams.get("code");

onMounted(async () => {
  if (code || Cookies.get('userLogin')) {
    // Exchange the authorization code for an access token
    try {
      const response = await axios.post("https://api.intra.42.fr/oauth/token", {
        grant_type: "authorization_code",
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
        code: code,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI
      });
      const accessToken = response.data.access_token;

      // Use the access token to make authenticated requests
      const userResponse = await axios.get("https://api.intra.42.fr/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const user = userResponse.data;

      // Store the user information in the userInfo object
      userInfo.value = user;
      Cookies.set('userLogin', user.login, { expires: 1, secure: true, sameSite: 'Strict' });
    } catch (error) {
      console.error(error);
    }
    console.log(userInfo._rawValue);
    window.location.href = '/Profile';
  }
  else {
    window.location.href = '/';
  }
});

</script>
