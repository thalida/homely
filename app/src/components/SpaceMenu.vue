<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { useSpaceStore } from '@/stores/space';
import { useWidgetStore } from '@/stores/widget';
import router from '@/router';
import { ESidebarSection } from '@/constants/ui';

const uiStore = useUIStore();
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
function handleEditWidgetsClick() {
  uiStore.setActiveSidebar(props.spaceId, ESidebarSection.WIDGET)
  widgetsStore.startEditMode(props.spaceId)
}
</script>

<template>
  <div>
    <h2 class="font-bold">Space</h2>
    <label>
      <span>Space Name</span>
      <input v-if="isSpaceOwner" type="text" v-model="space.name" />
      <p v-else>{{ space.name }}</p>
    </label>
    <br />
    <label>
      <span>Space Description</span>
      <input v-if="isSpaceOwner" type="text" v-model="space.description" />
      <p v-else>{{ space.description }}</p>
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
      <button @click="handleEditWidgetsClick">Edit Widgets</button>
    </div>
  </div>
</template>

<style scoped>
</style>
