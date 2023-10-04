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
      path: "/game",
      name: "game",
      component: () => import("@/components/Game.vue"),
    },
    {
      path: "/leaderboard",
      name: "leaderboard",
      component: () => import("@/components/Leaderboard.vue"),
    },
    {
      path: "/chat",
      name: "chat",
      component: () => import("@/components/Chat.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/components/Profile.vue"),
    },
    {
      path: "/sign-in",
      name: "sign-in",
      component: () => import("@/components/SignIn.vue"),
    },
    {
      path: "/user",
      name: "user",
      component: () => import("@/components/User.vue"),
    },
  ],
});

export default router;
