<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, type Component } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget';
import router from '@/router';
import { widgetMenuSettingsComponentsByType, widgetAddBtnComponents } from '@/widgets';
import { filter } from 'lodash';

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})

const uiStore = useUIStore()
const userStore = useUserStore()
const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()

const space = computed(() => {
  return spaceStore.collection[props.spaceId];
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

const isEditing = computed(() => {
  return isSpaceOwner.value && (widgetStore.isEditing[props.spaceId] || spaceStore.isEditing[props.spaceId]);
});

function handleEditSpace() {
  spaceStore.startEditMode(props.spaceId);
  widgetStore.startEditMode(props.spaceId);
}

function handleSaveChanges() {
  spaceStore.saveAndStopEditMode(props.spaceId);
  widgetStore.saveAndStopEditMode(props.spaceId);
}

function handleDiscardChanges() {
  widgetStore.discardAndStopEditMode(props.spaceId)
  spaceStore.discardAndStopEditMode(props.spaceId)
}

async function handleCloneSpace() {
  const newSpace = await spaceStore.cloneSpace(props.spaceId)
  router.push({ name: 'Space', params: { spaceId: newSpace.uid } })
}

async function handleDeleteSpace() {
  await spaceStore.deleteSpace(props.spaceId)
  await widgetStore.deleteWidgetsBySpace(props.spaceId)
  router.push({ name: 'Home' })
}

function handleToggleDefaultSpace() {
  const spaceId = (space.value.is_default) ? props.spaceId : null
  spaceStore.setDefaultSpace(spaceId)
}

function handleToggleBookmark() {
  spaceStore.toggleBookmark(props.spaceId)
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
  <div
    v-if="uiStore.isSidebarOpen"
    class="space-x-2 overflow-auto bg-slate-200 z-10 bg-opacity-90 shrink-0 h-full w-80 p-4 m-0"
  >
    <template v-if="isEditing">
      <button @click="handleDiscardChanges" class="p-2 bg-slate-400">Reset</button>
      <button @click="handleSaveChanges" class="p-2 bg-green-300">
        Save
      </button>
    </template>
    <div>
      <h2 class="font-bold">Space</h2>
      <label>
        <span>Space Name</span>
        <input v-if="isEditing" type="text" v-model="space.name" />
        <p v-else>{{ space.name }}</p>
      </label>
      <br />
      <label>
        <span>Space Description</span>
        <input v-if="isEditing" type="text" v-model="space.description" />
        <p v-else>{{ space.description }}</p>
      </label>
      <div  v-if="!isEditing" class="flex flex-col flex-wrap">
        <button @click="handleEditSpace">
          Edit
        </button>
        <button @click="handleCloneSpace">
          Clone Space
        </button>
        <button @click="handleDeleteSpace" v-if="isSpaceOwner">
          Delete Space
        </button>
        <label v-if="isSpaceOwner">
          <span>Make Default</span>
          <input type="checkbox" v-model="space.is_default" @change="handleToggleDefaultSpace" />
        </label>
        <label v-else>
          <span>Bookmark</span>
          <input type="checkbox" v-model="space.is_bookmarked" @change="handleToggleBookmark" />
        </label>
      </div>
    </div>
    <div v-if="isEditing">
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
