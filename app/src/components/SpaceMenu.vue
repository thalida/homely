<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { filter } from 'lodash';
import { useUserStore } from '@/stores/user';
import { useSpaceStore } from '@/stores/space';
import { useWidgetStore } from '@/stores/widget';
import { widgetAddBtnComponents } from '@/widgets'

const userStore = useUserStore();
const spaceStore = useSpaceStore();
const widgetsStore = useWidgetStore();

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
});

onMounted(async () => {
  window.addEventListener('beforeunload', handlePageRefresh)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handlePageRefresh)
})

const space = computed(() => {
  return spaceStore.collection[props.spaceId];
});

const isSpaceOwner = computed(() => {
  return userStore.user?.pk === space.value?.owner;
});

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

function handlePageRefresh(e: BeforeUnloadEvent) {
  const isProduction = import.meta.env.PROD
  if (isProduction && spaceStore.isEditMode) {
    e.preventDefault()
    e.returnValue = ''
  }
}

async function handleDelete() {
  for (const widget of selectedWidgets.value) {
    widgetsStore.draftDeleteWidget(widget);
  }
}
</script>

<template>
  <div
    ref="menuRef"
    class="space-x-2 overflow-auto bg-slate-200 z-10 bg-opacity-90"
    :class="{
      'h-auto w-auto p-0 m-4': !spaceStore.isEditMode,
      'h-full w-80 p-4 m-0': spaceStore.isEditMode,
    }"
  >
    <template v-if="isSpaceOwner && spaceStore.isEditMode">
      <h2 class="font-bold">Space</h2>
      <label>
        <span>Space Name</span>
        <input type="text" v-model="space.name" />
      </label>
      <br />
      <label>
        <span>Space Description</span>
        <input type="text" v-model="space.description" />
      </label>

      <h2 class="font-bold">Widgets</h2>
      <button @click="handleDelete" class="p-2 bg-red-400 disabled:opacity-50" :disabled="numSelectedWidgets === 0">Delete</button>
      <div v-if="numSelectedWidgets === 0" class="grid grid-cols-3 gap-2">
        <component
          v-for="component in widgetAddBtnComponents"
          :key="component.name"
          :is="component"
        />
      </div>
    </template>
    <div id="space__shared-widget-menu"></div>
    <div id="space__widget-menu"></div>
  </div>
</template>

<style scoped>
</style>
