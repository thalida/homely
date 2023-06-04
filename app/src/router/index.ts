import { createRouter, createWebHistory } from "vue-router";
import SpaceView from "@/views/SpaceView.vue";
import { useUserStore } from "@/stores/user";
import { useSpaceStore } from "@/stores/space";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/s/:spaceUid",
      props: true,
      name: "Space",
      component: SpaceView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    },
  ],
});

router.beforeEach(async (to) => {
  if (to.name === "Space" && to.params.spaceUid) {
    return;
  }

  const userStore = useUserStore();
  const spaceStore = useSpaceStore();

  if (!userStore.isAuthenticated) {
    await spaceStore.fetchHomepageSpaces()
    const spaceUid = spaceStore.homepageSpaces[0].uid
    return { name: "Space", params: { spaceUid } }
  }

  const spaceUid = spaceStore.defaultSpace
  return { name: "Space", params: { spaceUid } }
});

export default router;
