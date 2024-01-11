<script>
    import { getUserByUserId } from './api/get.call';
	import Cookies from 'js-cookie';

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
                    if (isValid)
                        window.location.href = "/settings";
                }
                catch (error) {
                    alert('Invalid 2fa code');
                    this.userToken = '';
                }
            }
        },
        async mounted(){
            const cookieJWT = Cookies.get('Bearer');
            const cookieUserId = Cookies.get('UserId');
            if (typeof cookieJWT != 'undefined' && typeof cookieUserId != 'undefined')
                this.user = await getUserByUserId(cookieUserId);
            else
                window.location.href = "/";
        }
    }
</script>

<template>
    <div class="grid grid-cols-1 min-h-[calc(100vh-174px)] font-mono bg-base-200 place-items-center">
        <form @submit.prevent="verifyToken">
            <input class="input input-bordered" type="text" v-model="userToken" placeholder="Enter your A2F token" required pattern="\d{6}" />
            <button class="btn btn-secondary text-white font-bold my-4" type="submit">Sign In</button>
        </form>
    </div>
</template>
