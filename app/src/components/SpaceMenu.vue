<script setup lang="ts">
import { useSpaceStore } from '@/stores/space';
import { computed, ref, type Component, watchEffect, onMounted } from 'vue';
import { widgetComponents, LINK_WIDGET_KEY, TEXT_WIDGET_KEY } from '@/components/widgets';

const spaceStore = useSpaceStore();

const emits = defineEmits<{
  (e: 'editModeCancel'): void
  (e: 'editModeStart'): void
  (e: 'editModeDone'): void
}>();

const activeWidgetComponentKey = ref<typeof LINK_WIDGET_KEY | typeof TEXT_WIDGET_KEY | null>(null);
const showModal = ref(false);

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

function handleAddLinkClick() {
  activeWidgetComponentKey.value = LINK_WIDGET_KEY;
  showModal.value = true;
}

onMounted(() => {
  if(spaceStore.isEditMode) {
    emits('editModeStart');
  }
})
</script>

<template>
  <div class="space-layout__menu">
    <button v-if="spaceStore.isEditMode" @click="handleEditModeCancel">Cancel</button>
    <button @click="handleEditModeToggle">
      {{ spaceStore.isEditMode ? 'Done' : 'Edit' }}
    </button>
    <button @click="handleAddLinkClick">Add Link</button>
  </div>
  <teleport to="body">
    <component
      v-if="activeWidgetComponentKey"
      :is="widgetComponents[activeWidgetComponentKey].modal"
      :show="showModal"
      @submit="showModal = false"
      @cancel="showModal = false"
    />
  </teleport>
</template>

<style scoped>
.space-layout__menu {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: #eee;
  padding: 8px;
  border-bottom: 1px solid #ddd;
  width: 100%;
  height: 32px;
}
</style>
