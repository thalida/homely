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
  <div class="space-layout__menu fixed space-x-2 top-0 left-0 w-full p-4 bg-slate-200 z-10 bg-opacity-90">
    <button v-if="spaceStore.isEditMode" @click="handleEditModeCancel" class="p-2 bg-slate-400">Cancel</button>
    <button @click="handleEditModeToggle" class="p-2 bg-green-300">
      {{ spaceStore.isEditMode ? 'Done' : 'Edit' }}
    </button>
    <button @click="handleAddLinkClick" class="p-2 bg-blue-400">Add Link</button>
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
</style>
