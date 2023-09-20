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
      path: "/about",
      name: "about",
      component: () => import("@/components/About.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/components/Profile.vue"),
    },
  ],
});

export default router;
