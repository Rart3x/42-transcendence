<script>
    import { getUserByUserId, checkA2F } from './api/get.call';
	import Cookies from 'js-cookie';
    import EventBus from '../services/event-bus.ts';

    export default {
        data(){
            return {
                userToken: null,
                user: null,
                cookieJWT: null,
                A2FKey: 0
            }
        },
        methods: {
            refreshA2F(){
                this.A2FKey += 1;
            },
            async verifyToken(){
                try {
                    const isValid = await checkA2F(this.user.userName, this.userToken, this.cookieJWT);

                    const cookieUserId = Cookies.get('UserId');

                    if (isValid){
                        this.user = await getUserByUserId(cookieUserId, this.cookieJWT);
                        window.location.href = "/settings";
                    }
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
        },
        created(){
            const eventBus = EventBus.getInstance();
            eventBus.subscribe('refreshA2F', this.refreshA2F);
        },
        beforeDestroy() {
            const eventBus = EventBus.getInstance();
            eventBus.unsubscribe('refreshA2F', this.refreshA2F);
        },
    }
</script>

<template>
    <div :ref="A2F" :key="A2FKey" class="grid grid-cols-1 min-h-[calc(100vh-114px)] font-mono bg-base-200 place-items-center">
        <form name="verifyToken" @submit.prevent="verifyToken">
            <input  name="inputVerifyToken" class="input input-bordered" type="text" v-model="userToken" placeholder="Enter your A2F token" required pattern="\d{6}" />
            <button name="signInButton" class="btn btn-secondary text-white font-bold my-4" type="submit">Sign In</button>
        </form>
    </div>
</template>
