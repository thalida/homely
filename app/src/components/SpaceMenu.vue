<script setup lang="ts">
import { useSpaceStore } from '@/stores/space';
import { computed, onBeforeUnmount, onMounted, ref, type Component, type Ref } from 'vue';
import { filter } from 'lodash';
import type { IWidgetButton } from '@/stores/widget';
import { widgetButtons as LinkWidgetButtons } from './widgets/LinkWidget';

const spaceStore = useSpaceStore();

const emits = defineEmits<{
  (e: 'editModeCancel'): void
  (e: 'editModeStart'): void
  (e: 'editModeDone'): void
  (e: 'addModuleDrag', event: DragEvent, widgetButton: IWidgetButton): void
  (e: 'addModuleDragEnd', event: DragEvent, widgetButton: IWidgetButton): void
}>();

const widgetButtons = ref([
  {
    name: 'Link',
    buttons: LinkWidgetButtons
  },
])

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

function drag(e: DragEvent, widgetButton: IWidgetButton) {
  spaceStore.widgets.updateAllWidgets({ state: { selected: false } })
  emits('addModuleDrag', e, widgetButton);
}

function dragEnd(e: DragEvent, widgetButton: IWidgetButton) {
  spaceStore.widgets.updateAllWidgets({ state: { selected: false } })
  emits('addModuleDragEnd', e, widgetButton);
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
      <div v-for="section in widgetButtons" :key="section.name">
        {{ section.name }}
        <div
          v-for="button in section.buttons"
          :key="`${section.name}-${button.name}`"
          class="droppable-element w-12 p-2 bg-blue-400"
          draggable="true"
          unselectable="on"
          @drag="drag($event, button)"
          @dragend="dragEnd($event, button)"
        >
          {{ button.name }}
        </div>
      </div>
    </template>
    <div id="space__widget-menu"></div>
  </div>
</template>

<style scoped>
</style>
