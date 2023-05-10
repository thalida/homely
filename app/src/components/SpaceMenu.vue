<script setup lang="ts">
import { useSpaceStore } from '@/stores/space';
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { filter } from 'lodash';
import { EWidgetType } from '@/stores/widget';

const spaceStore = useSpaceStore();

const emits = defineEmits<{
  (e: 'editModeCancel'): void
  (e: 'editModeStart'): void
  (e: 'editModeDone'): void
  (e: 'addModuleDrag', event: DragEvent, widgetType: EWidgetType): void
  (e: 'addModuleDragEnd', event: DragEvent, widgetType: EWidgetType): void
}>();

const selectedWidgets = computed(() => {
  return filter(spaceStore.widgets.collection, (w) => w.state.selected);
});
const numSelectedWidgets = computed(() => {
  return selectedWidgets.value.length;
});

onMounted(() => {
  window.addEventListener('keyup', handleWindowKeyup)
})

onBeforeUnmount(() => {
  window.removeEventListener('keyup', handleWindowKeyup)
})

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
}

function drag(e: DragEvent, widgetType: EWidgetType) {
  spaceStore.widgets.updateAllWidgets({ state: { selected: false } })
  emits('addModuleDrag', e, widgetType);
}

function dragEnd(e: DragEvent, widgetType: EWidgetType) {
  spaceStore.widgets.updateAllWidgets({ state: { selected: false } })
  emits('addModuleDragEnd', e, widgetType);
}

function handleWindowKeyup(e: KeyboardEvent) {
  if (e.key === 'Backspace') {
    handleDelete();
  }
}
</script>

<template>
  <div ref="menuRef" class="space-layout__menu fixed space-x-2 top-0 left-0 w-full p-4 bg-slate-200 z-10 bg-opacity-90">
    <button v-if="spaceStore.isEditMode" @click="handleEditModeCancel" class="p-2 bg-slate-400">Cancel</button>
    <button @click="handleEditModeToggle" class="p-2 bg-green-300">
      {{ spaceStore.isEditMode ? 'Save' : 'Edit' }}
    </button>
    <template v-if="spaceStore.isEditMode">
      {{ numSelectedWidgets }} selected:
      <button @click="handleDelete" class="p-2 bg-red-400 disabled:opacity-50" :disabled="numSelectedWidgets === 0">Delete</button>
      <div
        class="droppable-element w-12 p-2 bg-blue-400"
        draggable="true"
        unselectable="on"
        @drag="drag($event, EWidgetType.LINK)"
        @dragend="dragEnd($event, EWidgetType.LINK)"
      >
        Link
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
