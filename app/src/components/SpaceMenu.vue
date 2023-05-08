<script setup lang="ts">
import { useSpaceStore } from '@/stores/space';
const spaceStore = useSpaceStore();

const emits = defineEmits<{
  (e: 'editModeCancel'): void
  (e: 'editModeStart'): void
  (e: 'editModeDone'): void
}>();

function handleEditModeCancel() {
  spaceStore.setEditMode(false);
  emits('editModeCancel');
}
function handleEditModeToggle() {
  spaceStore.toggleEditMode();
  if (spaceStore.isEditMode) {
    emits('editModeStart');
  } else {
    emits('editModeDone');
  }
}
</script>

<template>
  <div class="space-layout__menu">
    <button v-if="spaceStore.isEditMode" @click="handleEditModeCancel">Cancel</button>
    <button @click="handleEditModeToggle">
      {{ spaceStore.isEditMode ? 'Done' : 'Edit' }}
    </button>
    <!-- <button @click="handleAddLinkClick">Add Link</button> -->
  </div>
</template>

<style scoped>
.space-layout__menu {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: #eee;
  padding: 8px;
  border-bottom: 1px solid #ddd;
  width: 100%;
  height: 32px;
}
</style>
