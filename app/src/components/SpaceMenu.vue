<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useSpaceStore } from '@/stores/space';
import { useWidgetStore } from '@/stores/widget';
import router from '@/router';

const userStore = useUserStore();
const spaceStore = useSpaceStore();
const widgetsStore = useWidgetStore();

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
});

const space = computed(() => {
  return spaceStore.collection[props.spaceId];
});

const isSpaceOwner = computed(() => {
  return userStore.user?.pk === space.value?.owner;
});

async function handleCloneSpace() {
  const newSpace = await spaceStore.cloneSpace(props.spaceId)
  router.push({ name: 'Space', params: { spaceId: newSpace.uid } })
}

async function handleDeleteSpace() {
  await spaceStore.deleteSpace(props.spaceId)
  await widgetsStore.deleteWidgetsBySpace(props.spaceId)
  router.push({ name: 'Home' })
}

function handleToggleDefaultSpace() {
  const spaceId = (space.value.is_default) ? props.spaceId : null
  spaceStore.setDefaultSpace(spaceId)
}

function handleToggleBookmark() {
  spaceStore.toggleBookmark(props.spaceId)
}
</script>

<template>
  <div
    v-if="isSpaceOwner && spaceStore.isEditMode"
    ref="menuRef"
    class="space-x-2 overflow-auto bg-slate-200 z-10 bg-opacity-90 shrink-0"
    :class="{
      'h-auto w-auto p-0 m-4': !spaceStore.isEditMode,
      'h-full w-80 p-4 m-0': spaceStore.isEditMode,
    }"
  >
    <h2 class="font-bold">Space</h2>
    <label>
      <span>Space Name</span>
      <input type="text" v-model="space.name" />
    </label>
    <br />
    <label>
      <span>Space Description</span>
      <input type="text" v-model="space.description" />
    </label>
    <div class="flex flex-col flex-wrap">
      <button @click="handleCloneSpace">
        Clone Space
      </button>
      <button @click="handleDeleteSpace" v-if="isSpaceOwner">
        Delete Space
      </button>
      <label v-if="isSpaceOwner">
        <span>Make Default</span>
        <input type="checkbox" v-model="space.is_default" @change="handleToggleDefaultSpace" />
      </label>
      <label v-else>
        <span>Bookmark</span>
        <input type="checkbox" v-model="space.is_bookmarked" @change="handleToggleBookmark" />
      </label>
    </div>
  </div>
</template>

<style scoped>
</style>
