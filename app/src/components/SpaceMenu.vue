<script setup lang="ts">
import { useSpaceStore } from '@/stores/space';
import { ref, computed, nextTick } from 'vue';
import { widgetComponents, LINK_WIDGET_KEY, TEXT_WIDGET_KEY } from '@/components/widgets';
import { filter, map } from 'lodash';
import type { IWidget } from '@/stores/widget';

const spaceStore = useSpaceStore();

const emits = defineEmits<{
  (e: 'editModeCancel'): void
  (e: 'editModeStart'): void
  (e: 'editModeDone'): void
  (e: 'deletedWidgets'): void
  (e: 'addModuleStart', widgetType: string): void
  (e: 'addModuleSubmit', widget: IWidget): void
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
  emits('addModuleStart', LINK_WIDGET_KEY);
}

function handleAddModuleSubmit(widget: IWidget) {
  showModal.value = false;
  activeWidgetComponentKey.value = null;
  emits('addModuleSubmit', widget);
}

function handleChangeZindex(amount: number) {
  if (numSelectedWidgets.value === 0) {
    return;
  }

  let maxZindex: number = 0;
  let minZindex: number = 0;
  if (amount === Infinity) {
    maxZindex = Math.max(...map(spaceStore.widgets.collection, (w) => w.styles.zIndex))
  } else if (amount === -Infinity) {
    minZindex = Math.min(...map(spaceStore.widgets.collection, (w) => w.styles.zIndex))
  }

  for (const widget of selectedWidgets.value) {
    let zIndex: number = widget.styles.zIndex;

    if (amount === Infinity) {
      zIndex = maxZindex + 1
    } else if (amount === -Infinity) {
      zIndex = minZindex - 1
    }

    spaceStore.widgets.updateWidget(widget.id, {
      styles: { zIndex }
    })
  }
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
    <template v-if="spaceStore.isEditMode">
      <button @click="handleChangeZindex(Infinity)" class="p-2 bg-slate-400 disabled:opacity-50" :disabled="numSelectedWidgets === 0">Move to Front</button>
      <button @click="handleChangeZindex(-Infinity)" class="p-2 bg-slate-400 disabled:opacity-50" :disabled="numSelectedWidgets === 0">Move to Back</button>
    </template>
  </div>
  <teleport to="body">
    <component
      v-if="activeWidgetComponentKey"
      :is="widgetComponents[activeWidgetComponentKey].modal"
      :show="showModal"
      @submit="handleAddModuleSubmit"
      @cancel="showModal = false"
    />
  </teleport>
</template>

<style scoped>
</style>
