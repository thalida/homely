<script setup lang="ts">
import { computed, type Component } from 'vue';
import { filter } from 'lodash';
import { useUserStore } from '@/stores/user';
import { useSpaceStore } from '@/stores/space';
import { useWidgetStore } from '@/stores/widget';
import { widgetAddBtnComponents, widgetMenuSettingsComponentsByType } from '@/widgets'
import SpaceWidgetGlobalSettings from '@/components/SpaceWidgetGlobalSettings.vue';

const userStore = useUserStore();
const spaceStore = useSpaceStore();
const widgetsStore = useWidgetStore();

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
});

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

const selectedWidgetMenuComponents = computed(() => {
  const components: Record<string, Component> = {};

  for (const widgetId of selectedWidgets.value) {
    const widget = widgetsStore.getWidgetById(widgetId);
    components[widgetId] = widgetMenuSettingsComponentsByType[widget.widget_type];
  }

  return components;
});

async function handleDelete() {
  for (const widget of selectedWidgets.value) {
    widgetsStore.draftDeleteWidget(widget);
  }
}
</script>

<template>
  <div
    v-if="isSpaceOwner && spaceStore.isEditMode"
    ref="menuRef"
    class="space-x-2 overflow-auto bg-slate-200 z-10 bg-opacity-90 shrink-0"
    :class="{
      'h-auto w-auto p-0 m-4': !spaceStore.isEditMode,
      'h-full w-80 p-4 m-0': spaceStore.isEditMode,
    }"
  >
    <h2 class="font-bold">Widgets</h2>
    <button @click="handleDelete" class="p-2 bg-red-400 disabled:opacity-50" :disabled="numSelectedWidgets === 0">Delete</button>
    <div v-if="numSelectedWidgets === 0" class="grid grid-cols-3 gap-2">
      <component
        v-for="component in widgetAddBtnComponents"
        :key="component.name"
        :is="component"
      />
    </div>

    <div v-for="widgetId in selectedWidgets" :key="widgetId">
      <SpaceWidgetGlobalSettings :widgetId="widgetId" />
      <component
        :is="selectedWidgetMenuComponents[widgetId]"
        :widgetId="widgetId"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
