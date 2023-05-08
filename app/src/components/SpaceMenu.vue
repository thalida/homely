<script setup lang="ts">
import { useSpaceStore } from '@/stores/space';
import { computed, ref, type Component, watchEffect } from 'vue';
import { widgetComponents, LINK_WIDGET_KEY, TEXT_WIDGET_KEY } from '@/components/widgets';

const spaceStore = useSpaceStore();

const emits = defineEmits<{
  (e: 'editModeCancel'): void
  (e: 'editModeStart'): void
  (e: 'editModeDone'): void
}>();

const activeWidgetComponentKey = ref<typeof LINK_WIDGET_KEY | typeof TEXT_WIDGET_KEY | null>(null);
const widgetModal = ref<Component | null>(null);
const showModal = ref(false);

// watchEffect(async () => {
//   if (activeWidgetComponentKey.value === null) {
//     return;
//   }

//   const components = widgetComponents[activeWidgetComponentKey.value];
//   widgetModal.value = components.modalComponent
//   console.log(widgetModal.value);
// });

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
      :is="widgetComponents[activeWidgetComponentKey].modalComponent"
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
