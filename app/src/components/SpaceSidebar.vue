<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget';
import SpaceSettings from './SpaceSettings.vue'
import SpaceWidgetSettings from './SpaceWidgetSettings.vue'

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})

const uiStore = useUIStore()
const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()

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
</script>

<template>
  <div
    v-if="uiStore.isWidgetSidebarOpen || uiStore.isSpaceSidebarOpen"
    class="space-x-2 overflow-auto bg-slate-200 z-10 bg-opacity-90 shrink-0 h-full w-80 p-4 m-0"
  >
    <SpaceSettings v-if="uiStore.isSpaceSidebarOpen" :spaceId="spaceId" />
    <SpaceWidgetSettings v-if="uiStore.isWidgetSidebarOpen" :spaceId="spaceId" />
  </div>
</template>

<style scoped>

</style>
