<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget';
import router from '@/router';

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

const isSpaceOwner = computed(() => {
  return userStore.user?.pk === space.value?.owner;
});

const isEditingSpace = computed(() => {
  return isSpaceOwner.value && spaceStore.isEditing[props.spaceId];
});

function handleEditSpace() {
  spaceStore.startEditMode(props.spaceId);
  widgetStore.startEditMode(props.spaceId);
}

function handleSaveSpaceChanges() {
  spaceStore.saveAndStopEditMode(props.spaceId);
}

function handleDiscardSpaceChanges() {
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
</script>

<template>
  <div>
    <template v-if="isEditingSpace">
      <button @click="handleDiscardSpaceChanges" class="p-2 bg-slate-400">Reset</button>
      <button @click="handleSaveSpaceChanges" class="p-2 bg-green-300">
        Save
      </button>
    </template>
    <div>
      <h2 class="font-bold">Space</h2>
      <label>
        <span>Space Name</span>
        <input v-if="isEditingSpace" type="text" v-model="space.name" />
        <p v-else>{{ space.name }}</p>
      </label>
      <br />
      <label>
        <span>Space Description</span>
        <input v-if="isEditingSpace" type="text" v-model="space.description" />
        <p v-else>{{ space.description }}</p>
      </label>
      <label v-if="isEditingSpace">
        <span>Make Default</span>
        <input type="checkbox" v-model="space.is_default" @change="handleToggleDefaultSpace" />
      </label>
      <div v-if="userStore.isAuthenticated && !isEditingSpace" class="flex flex-col flex-wrap">
        <template v-if="isSpaceOwner">
          <button @click="handleEditSpace">
            Edit
          </button>
          <button @click="handleDeleteSpace">
            Delete Space
          </button>
        </template>
        <template v-else>
          <label>
            <span>Bookmark</span>
            <input type="checkbox" v-model="space.is_bookmarked" @change="handleToggleBookmark" />
          </label>
        </template>
        <button @click="handleCloneSpace">
          Clone Space
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
