import Cookies from "js-cookie";
import { createRouter, createWebHistory } from "vue-router";
import { getChannelByName, getUserByUserId, getUserByUserName } from "../components/api/get.call";

let comingFromCheckPass = false;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/2fa",
      name: "2fa",
      component: () => import("@/components/2FA.vue"),
      beforeEnter: async(to, from, next) => {
        let cookieJWT = Cookies.get('Bearer');
        let cookieUserId = Cookies.get('UserId');

        const actualUser = await getUserByUserId(cookieUserId, cookieJWT);

        if (actualUser.status != 'offline')
          next('/error')
        else
          next()
      }
    },
    {
      path: "/channel/:channelName",
      name: "channel",
      component: () => import("@/components/Channel.vue"),
      beforeEnter: async (to, from, next) => {

        let cookieJWT = Cookies.get('Bearer');
        let cookieUserId = Cookies.get('UserId');

        const channelName = to.params.channelName;
        const channel = await getChannelByName(channelName, cookieJWT);
        const actualUser = await getUserByUserId(cookieUserId, cookieJWT);

        if (!channel)
          next('/error');
        else if (channel && channel.channelUsers) {
          if (!channel.channelUsers.find(user => user.userId === actualUser.userId) || channel.isPrivate)
            next('/error');
        }
        else (channel)
          next();
      },
    },
    {
      path: "/checkPass/:channelName",
      name: "checkPass",
      component: () => import("@/components/CheckPass.vue"),
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/error"
    },
    {
      path: "/error",
      name: "error",
      component: () => import("@/components/Error.vue"),
    },
    {
      path: "/game",
      name: "game",
      component: () => import("@/components/GameComponent/Game.vue"),
    },
    {
      path: "/",
      name: "home",
      component: () => import("@/components/Home.vue"),
    },
    {
      path: "/leaderboard",
      name: "leaderboard",
      component: () => import("@/components/Leaderboard.vue"),
    },
    {
      path: "/profile",
      name: "userProfile",
      component: () => import("@/components/UserProfile.vue"),
    },
    {
      path: "/profile/:userName",
      name: "profile",
      component: () => import("@/components/Profile.vue"),
      beforeEnter: async (to, from, next) => {
        let cookieJWT = Cookies.get('Bearer');

        const userName = to.params.userName;
        const user = await getUserByUserName(userName, cookieJWT);

        if (user)
          next();
        else
          next('/error');
      },
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("@/components/Settings.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  let cookieUserId = Cookies.get('UserId');
  let cookieJWT = Cookies.get('Bearer');
  let user;

  if (typeof cookieUserId !== 'undefined' && typeof cookieJWT !== 'undefined'){
    user = await getUserByUserId(cookieUserId, cookieJWT);
  }
  const path = to.path;
  if (path === '/checkPass/:channelName')
    comingFromCheckPass = true;

  if (to.path == '/2fa' && user && user.A2F == true && user.A2FValid == false) {
    next();
  }
  else if (user && user.A2FValid == false && user.A2F == true && to.path != '/2fa') {
    next('/2fa');
  }
  else{
    next();
  }
});

export default router;