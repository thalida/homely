<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, type Component } from 'vue'
import { filter } from 'lodash';
import { useUserStore } from '@/stores/user'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget';
import { widgetMenuSettingsComponentsByType, widgetAddBtnComponents } from '@/widgets';

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})

const userStore = useUserStore()
const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()

const space = computed(() => {
  return spaceStore.collection[props.spaceId];
});

const dirtyWidgets = computed(() => {
  return widgetStore.dirtyWidgetsBySpace[props.spaceId];
});

const hasDirtyWidgets = computed(() => {
  return dirtyWidgets.value.length > 0;
});

onMounted(async () => {
  window.addEventListener('beforeunload', handlePageRefresh)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handlePageRefresh)
})


function handlePageRefresh(e: BeforeUnloadEvent) {
  const isProduction = import.meta.env.PROD
  if (isProduction && (widgetStore.isEditing[props.spaceId] || spaceStore.isEditing[props.spaceId])) {
    e.preventDefault()
    e.returnValue = ''
  }
}

const isSpaceOwner = computed(() => {
  return userStore.user?.pk === space.value?.owner;
});

const isEditingWidgets = computed(() => {
  return isSpaceOwner.value && widgetStore.isEditing[props.spaceId];
});

async function handleSaveWidgetChanges() {
  await widgetStore.saveDirtyWidgets(props.spaceId);
  widgetStore.startEditMode(props.spaceId);
}

function handleDiscardWidgetChanges() {
  widgetStore.resetWidgetsFromBackup(props.spaceId);
}

const selectedWidgets = computed(() => {
  const widgetIds = widgetStore.activeWidgetsBySpace[props.spaceId];
  return filter(widgetIds, (widgetId) => {
    const widget = widgetStore.getWidgetById(widgetId);
    return widget.state.selected;
  });
});

const numSelectedWidgets = computed(() => {
  return selectedWidgets.value.length;
});

const selectedWidgetMenuComponents = computed(() => {
  const components: Record<string, Component> = {};

  for (const widgetId of selectedWidgets.value) {
    const widget = widgetStore.getWidgetById(widgetId);
    components[widgetId] = widgetMenuSettingsComponentsByType[widget.widget_type];
  }

  return components;
});

async function handleDelete() {
  for (const widget of selectedWidgets.value) {
    widgetStore.draftDeleteWidget(widget);
  }
}
</script>

<template>
  <div>
    {{ hasDirtyWidgets }} {{ dirtyWidgets }}
    <template v-if="isEditingWidgets">
      <button @click="handleDiscardWidgetChanges" class="p-2 bg-slate-400 disabled:opacity-50" :disabled="!hasDirtyWidgets">Reset</button>
      <button @click="handleSaveWidgetChanges" class="p-2 bg-green-300 disabled:opacity-50" :disabled="!hasDirtyWidgets">
        Save
      </button>
    </template>
    <div v-if="isEditingWidgets">
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
  </div>
</template>

<style scoped>

</style>
