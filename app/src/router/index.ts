import { createRouter, createWebHistory } from "vue-router";
import SpaceView from "@/views/SpaceView.vue";
import { useUserStore } from "@/stores/user";
import { useSpaceStore } from "@/stores/space";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/s/:spaceId",
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
  if (to.name === "Space" && to.params.spaceId) {
    return;
  }

  const userStore = useUserStore();
  const spaceStore = useSpaceStore();

  await userStore.autoLogin();

  if (!userStore.isAuthenticated) {
    await spaceStore.fetchHomepageSpaces()
    const spaceId = spaceStore.homepageSpaces[0].uid
    return { name: "Space", params: { spaceId } }
  }

  const spaceId = spaceStore.defaultSpace
  return { name: "Space", params: { spaceId } }
});

export default router;
