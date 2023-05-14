<script setup lang="ts">
import { filter } from 'lodash';
import { useSpaceStore } from '@/stores/space';
import { computed } from 'vue';
import type { IWidgetButton } from '@/types/widget';
import { widgetMenuItems } from './widgets';

const spaceStore = useSpaceStore();

const emits = defineEmits<{
  (e: 'editModeCancel'): void
  (e: 'editModeStart'): void
  (e: 'editModeDone'): void
  (e: 'addModuleDrag', event: DragEvent, widgetButton: IWidgetButton): void
  (e: 'addModuleDragEnd', event: DragEvent, widgetButton: IWidgetButton): void
}>();

const selectedWidgets = computed(() => {
  return filter(spaceStore.widgets.collection, (w) => w.state.selected);
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
}

function drag(e: DragEvent, widgetButton: IWidgetButton) {
  spaceStore.widgets.updateAllWidgets({ state: { selected: false } })
  emits('addModuleDrag', e, widgetButton);
}

function dragEnd(e: DragEvent, widgetButton: IWidgetButton) {
  spaceStore.widgets.updateAllWidgets({ state: { selected: false } })
  emits('addModuleDragEnd', e, widgetButton);
}
</script>

<template>
  <div ref="menuRef" class="space-layout__menu fixed space-x-2 top-0 right-0 overflow-auto bg-slate-200 z-10 bg-opacity-90"
  :class="{
    'h-auto w-auto p-0 m-4': !spaceStore.isEditMode,
    'h-full w-80 p-4 m-0': spaceStore.isEditMode,
  }">
    <button v-if="spaceStore.isEditMode" @click="handleEditModeCancel" class="p-2 bg-slate-400">Cancel</button>
    <button @click="handleEditModeToggle" class="p-2 bg-green-300">
      {{ spaceStore.isEditMode ? 'Save' : 'Edit' }}
    </button>
    <template v-if="spaceStore.isEditMode">
      {{ numSelectedWidgets }} selected:
      <button @click="handleDelete" class="p-2 bg-red-400 disabled:opacity-50" :disabled="numSelectedWidgets === 0">Delete</button>
      <div v-for="section in widgetMenuItems" :key="section.widgetType">
        {{ section.label }}
        <button
          v-for="button in section.buttons"
          :key="`${section.widgetType}-${button.style.id}`"
          class="w-12 p-2 bg-blue-400"
          draggable="true"
          unselectable="on"
          @drag="drag($event, button)"
          @dragend="dragEnd($event, button)"
        >
          {{ button.style.label }}
        </button>
      </div>
    </template>
    <div id="space__widget-menu"></div>
  </div>
</template>

<style scoped>
</style>
