<script setup lang="ts">
import { filter } from 'lodash';
import { useUserStore } from '@/stores/user';
import { useSpaceStore } from '@/stores/space';
import { useWidgetStore } from '@/stores/widget';
import { computed } from 'vue';
import type { IWidgetButton } from '@/types/widget';
import { widgetMenuItems } from '../widgets';
import { SettingsIcon } from 'lucide-vue-next';

const userStore = useUserStore();
const spaceStore = useSpaceStore();
const widgetsStore = useWidgetStore();

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
});

const emits = defineEmits<{
  (e: 'editModeCancel'): void,
  (e: 'editModeStart'): void,
  (e: 'editModeDone'): void,
  (e: 'addModule', event: Event, widgetButton: IWidgetButton): void,
}>();

const selectedWidgets = computed(() => {
  const widgetIds = widgetsStore.activeWidgetsBySpace[props.spaceId];
  return filter(widgetIds, (widgetId) => {
    const widget = widgetsStore.getWidgetById(widgetId);
    return widget.state.selected;
  });
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
    widgetsStore.draftDeleteWidget(widget);
  }
}

function handleAddModuleClick(e: Event, widgetButton: IWidgetButton) {
  emits('addModule', e, widgetButton);
}
</script>

<template>
  <div ref="menuRef" class="space-layout__menu fixed space-x-2 top-0 right-0 overflow-auto bg-slate-200 z-10 bg-opacity-90"
  :class="{
    'h-auto w-auto p-0 m-4': !spaceStore.isEditMode,
    'h-full w-80 p-4 m-0': spaceStore.isEditMode,
  }">
    <button v-if="spaceStore.isEditMode" @click="handleEditModeCancel" class="p-2 bg-slate-400">Cancel</button>
    <button v-if="spaceStore.isEditMode" @click="handleEditModeToggle" class="p-2 bg-green-300">
      Save
    </button>
    <button v-else @click="handleEditModeToggle" class="p-2 bg-green-300">
      <SettingsIcon />
    </button>
    <template v-if="spaceStore.isEditMode">
      <button @click="userStore.logout()">Logout</button>
      {{ numSelectedWidgets }} selected:
      <button @click="handleDelete" class="p-2 bg-red-400 disabled:opacity-50" :disabled="numSelectedWidgets === 0">Delete</button>
      <button
        v-for="menuItem in widgetMenuItems"
        :key="menuItem.label"
        class="w-12 p-2 bg-blue-400"
        @click="handleAddModuleClick($event, menuItem.widget)">
        {{ menuItem.label }}
      </button>
    </template>
    <div id="space__shared-widget-menu"></div>
    <div id="space__widget-menu"></div>
  </div>
</template>

<style scoped>
</style>
