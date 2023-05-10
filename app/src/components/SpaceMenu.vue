<script setup lang="ts">
import { useSpaceStore } from '@/stores/space';
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { LINK_WIDGET_KEY, TEXT_WIDGET_KEY, type TWidgetType } from '@/components/widgets';
import { filter } from 'lodash';

const spaceStore = useSpaceStore();

const emits = defineEmits<{
  (e: 'editModeCancel'): void
  (e: 'editModeStart'): void
  (e: 'editModeDone'): void
  (e: 'addModuleDrag', event: DragEvent, widgetType: TWidgetType): void
  (e: 'addModuleDragEnd', event: DragEvent, widgetType: TWidgetType): void
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

function drag(e: DragEvent, widgetType: TWidgetType) {
  spaceStore.widgets.updateAllWidgets({ state: { selected: false } })
  emits('addModuleDrag', e, widgetType);
}

function dragEnd(e: DragEvent, widgetType: TWidgetType) {
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
        @drag="drag($event, LINK_WIDGET_KEY as TWidgetType)"
        @dragend="dragEnd($event, LINK_WIDGET_KEY as TWidgetType)"
      >
        Link
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
