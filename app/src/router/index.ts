import { createRouter, createWebHistory } from "vue-router";
import SpaceView from "@/views/SpaceView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: SpaceView,
    },
    {
      path: "/s/:spaceUid",
      props: true,
      name: "Space",
      component: SpaceView,
    },
  ],
});

export default router;
