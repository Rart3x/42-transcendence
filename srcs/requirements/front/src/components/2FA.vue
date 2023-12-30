<script>
import { getUserByUserId } from './api/get.call';


export default {
    data(){
        return {
            userToken: null,
            user: null,
        }
    },
    methods: {
       async verifyToken(){
            try {
                const isValid = await checkA2F(this.user.userName, this.userToken);
                if (isValid) {
                    window.location.href = "/settings";
                }
            }
            catch (error) {
                Cookies.remove("UserId");
                Cookies.remove("Bearer");
                window.location.href = "/";
            }
        }
    },
    async mounted(){
        const cookieJWT = Cookies.get('Bearer');
        const cookieUserId = Cookies.get('UserId');
        if (typeof cookieJWT != 'undefined' && typeof cookieUserId != 'undefined')
            this.user = await getUserByUserId(cookieUserId);
        else{
            window.location.href = "/";
        }
    }
}
</script>

<template>
    <h1 class="title">Sign In with A2F</h1>
    <div class="flex justify-center">
      <form @submit.prevent="verifyToken">
        <input class="input input-bordered" type="text" v-model="userToken" placeholder="Enter your token" required pattern="\d{6}" />
        <button class="btn" type="submit">Sign In</button>
      </form>
    </div>
</template>