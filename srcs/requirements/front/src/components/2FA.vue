<script>
    import { getUserByUserId, checkA2F } from './api/get.call';
	import Cookies from 'js-cookie';

    export default {
        data(){
            return {
                userToken: null,
                user: null,
                cookieJWT: null
            }
        },
        methods: {
            async verifyToken(){
                try {
                    const isValid = await checkA2F(this.user.userName, this.userToken, this.cookieJWT);
                    if (isValid)
                        window.location.href = "/settings";
                    else
                        throw new Error("Invalid 2fa code")
                }
                catch (error) {
                    alert(error);
                    this.userToken = '';
                }
            }
        },
        async mounted(){
            this.cookieJWT = Cookies.get('Bearer');
            const cookieUserId = Cookies.get('UserId');
            if (typeof this.cookieJWT != 'undefined' && typeof cookieUserId != 'undefined')
                this.user = await getUserByUserId(cookieUserId, this.cookieJWT);
            else
                window.location.href = "/";
        }
    }
</script>

<template>
    <div class="grid grid-cols-1 min-h-screen font-mono bg-base-200 place-items-center">
        <form @submit.prevent="verifyToken">
            <input class="input input-bordered" type="text" v-model="userToken" placeholder="Enter your A2F token" required pattern="\d{6}" />
            <button class="btn btn-secondary text-white font-bold my-4" type="submit">Sign In</button>
        </form>
    </div>
</template>
