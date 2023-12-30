import Cookies from "js-cookie";
import { createRouter, createWebHistory } from "vue-router";
import { getChannelByName, getUserByUserId} from "../components/api/get.call";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:catchAll(.*)",
      redirect: "/error"
    },
    {
      path: "/",
      name: "home",
      component: () => import("@/components/Home.vue"),
    },
    {
      path: "/2fa",
      name: "2fa",
      component: () => import("@/components/2FA.vue"),
    },
    {
      path: "/channel/:channelName",
      name: "channel",
      component: () => import("@/components/Channel.vue"),
      beforeEnter: async (to, from, next) => {
        const channelName = to.params.channelName;
        const channel = await getChannelByName(channelName, cookieJWT);
        const actualUser = await getUserByUserId(cookieUserId, cookieJWT);

        if (channel && channel.channelUsers) {
          if (!channel.channelUsers.find(user => user.userId === actualUser.userId) && channel.isPrivate)
            next('/error');
        }
        else (channel)
          next();
      },
    },
    {
      path: "/error",
      name: "error",
      component: () => import("@/components/Error.vue"),
    },
    {
      path: "/game",
      name: "game",
      component: () => import("@/components/Game.vue"),
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
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("@/components/Settings.vue"),
    },
    {
      path: "/leaderboard",
      name: "leaderboard",
      component: () => import("@/components/Leaderboard.vue"),
    },
    {
      path: "/checkPass/:channelName",
      name: "checkPass",
      component: () => import("@/components/CheckPass.vue"),
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  let cookieUserId = Cookies.get('UserId');
  let cookieJWT = Cookies.get('Bearer');

  let user;
  if (typeof cookieUserId !== 'undefined' && typeof cookieJWT !== 'undefined')
    user = await getUserByUserId(cookieUserId, cookieJWT);
  const path = to.path;
  if (!user && path !== "/" && path !== "/sign-in")
    next('/');
  else
    next();
});

export default router;