<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SpaceMenu from './SpaceMenu.vue'
import { useUIStore } from '@/stores/ui'
import { useWidgetStore } from '@/stores/widget';

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})

const uiStore = useUIStore()
const widgetStore = useWidgetStore()
const spaceMenuRef = ref<InstanceType<typeof SpaceMenu>>()

onMounted(async () => {
  window.addEventListener('beforeunload', handlePageRefresh)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handlePageRefresh)
})


function handlePageRefresh(e: BeforeUnloadEvent) {
  const isProduction = import.meta.env.PROD
  if (isProduction && widgetStore.isEditing[props.spaceId]) {
    e.preventDefault()
    e.returnValue = ''
  }
}

</script>

<template>
  <div
    v-if="uiStore.isSidebarOpen"
    class="space-x-2 overflow-auto bg-slate-200 z-10 bg-opacity-90 shrink-0 h-full w-80 p-4 m-0"
  >
    <SpaceMenu
      ref="spaceMenuRef"
      :spaceId="props.spaceId" />
  </div>
</template>

<style scoped>

</style>
