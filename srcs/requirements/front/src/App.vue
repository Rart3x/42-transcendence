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
    <body>
      <div class="main-content">
        <Header ref="header" :key="headerKey" v-if="user" />
        <router-view></router-view>
        <Footer v-if="$route.path !== '/game'"/>
      </div>
    </body>
</template>

<style>
  .main-content { flex-grow: 1; }
  .wrapper { display: flex; flex-direction: column; min-height: 100vh;}
</style>
 