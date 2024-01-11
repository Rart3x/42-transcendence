<script>
  import Cookies from "js-cookie";
  import Header from "./components/Header.vue";
  import Footer from "./components/Footer.vue";
  import { getUserByUserId } from "./components/api/get.call";
  import "./assets/main.css"
  import EventBus from './services/event-bus.ts';

  export default {
    name: 'App',
    components: {
        Footer,
      Header
    },
    data(){
      return {
        user: null,
        headerKey: 0
      }
    },
    methods:{
      refreshHeader(){
        this.headerKey += 1;
      }
    },
    async mounted(){
      // Subscribe to an event
      const cookieUserId = Cookies.get('UserId');
      const cookieJWT = Cookies.get('Bearer');
      if (cookieUserId !== undefined && cookieJWT !== undefined)
        this.user= await getUserByUserId(cookieUserId, cookieJWT);
    },
    created() {
      const eventBus = EventBus.getInstance();
      eventBus.subscribe('refreshHeader', this.refreshHeader);
    },
    beforeDestroy() {
      const eventBus = EventBus.getInstance();
      eventBus.unsubscribe('refreshHeader', this.refreshHeader);
    },
  };
</script>

<template>
    <div class="flex flex-col min-h-screen">
      <body>
          <Header ref="header" :key="headerKey" v-if="user" />
          <router-view></router-view>
          <Footer v-if="$route.path !== '/game'"/>
      </body>
   </div>
</template>

<style>
</style>
 