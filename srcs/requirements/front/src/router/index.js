import Cookies from "js-cookie";
import { createRouter, createWebHistory } from "vue-router";
import { getChannelByName, getUserByCookie } from "../components/api/get.call";

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
      path: "/about",
      name: "about",
      component: () => import("@/components/About.vue"),
    },
    {
      path: "/channel/:channelName",
      name: "channel",
      component: () => import("@/components/Channel.vue"),
      beforeEnter: async (to, from, next) => {
        const channelName = to.params.channelName;
        const channelExists = await getChannelByName(channelName);

        if (channelExists)
          next();
        else
          next('/error');
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
      path: "/privateMessage/:senderName/:receiverName",
      name: "privateMessage",
      component: () => import("@/components/PrivateMessage.vue"),
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
      path: "/sign-in",
      name: "sign-in",
      component: () => import("@/components/SignIn.vue"),
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
  const user = await getUserByCookie(Cookies.get("_authToken"));
  const path = to.path;

  if (!user && path !== "/" && path !== "/sign-in")
    next('/');
  else
    next();
});

export default router;