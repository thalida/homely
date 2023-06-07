<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useSpaceStore } from '@/stores/space';

const userStore = useUserStore();
const spaceStore = useSpaceStore();

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
});

onMounted(async () => {
  window.addEventListener('beforeunload', handlePageRefresh)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handlePageRefresh)
})

const space = computed(() => {
  return spaceStore.collection[props.spaceId];
});

const isSpaceOwner = computed(() => {
  return userStore.user?.pk === space.value?.owner;
});

function handlePageRefresh(e: BeforeUnloadEvent) {
  const isProduction = import.meta.env.PROD
  if (isProduction && spaceStore.isEditMode) {
    e.preventDefault()
    e.returnValue = ''
  }
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
  </div>
</template>

<style scoped>
</style>
