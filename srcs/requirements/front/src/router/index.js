import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: "/sign-in",
      name: "sign-in",
      component: () => import("@/components/SignIn.vue"),
    },
    {
      path: "/history",
      name: "history",
      component: () => import("@/components/History.vue"),
    },
  ],
});

export default router;
