<script setup lang="ts">
import { useSpaceStore } from '@/stores/space';
import { ref, computed, nextTick } from 'vue';
import { widgetComponents, LINK_WIDGET_KEY, TEXT_WIDGET_KEY } from '@/components/widgets';
import { filter } from 'lodash';

const spaceStore = useSpaceStore();

const emits = defineEmits<{
  (e: 'editModeCancel'): void
  (e: 'editModeStart'): void
  (e: 'editModeDone'): void
  (e: 'deletedWidgets'): void
}>();

const activeWidgetComponentKey = ref<typeof LINK_WIDGET_KEY | typeof TEXT_WIDGET_KEY | null>(null);
const showModal = ref(false);

const selectedWidgets = computed(() => {
  return filter(spaceStore.widgets.collection, (w) => w.isSelected);
});
const numSelectedWidgets = computed(() => {
  return selectedWidgets.value.length;
});

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

async function handleDelete() {
  for (const widget of selectedWidgets.value) {
    spaceStore.widgets.deleteWidget(widget.id);
  }

  await nextTick();
  emits('deletedWidgets');
}

function handleAddLink() {
  activeWidgetComponentKey.value = LINK_WIDGET_KEY;
  showModal.value = true;
}
</script>

<template>
  <div class="space-layout__menu fixed space-x-2 top-0 left-0 w-full p-4 bg-slate-200 z-10 bg-opacity-90">
    <button v-if="spaceStore.isEditMode" @click="handleEditModeCancel" class="p-2 bg-slate-400">Cancel</button>
    <button @click="handleEditModeToggle" class="p-2 bg-green-300">
      {{ spaceStore.isEditMode ? 'Done' : 'Edit' }}
    </button>
    <template v-if="spaceStore.isEditMode">
      <button @click="handleDelete" class="p-2 bg-red-400 disabled:opacity-50" :disabled="numSelectedWidgets === 0">Delete {{ numSelectedWidgets }}</button>
      <button @click="handleAddLink" class="p-2 bg-blue-400">Add Link</button>
    </template>
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
