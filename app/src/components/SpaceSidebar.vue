<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SpaceMenu from './SpaceMenu.vue'
import SpaceWidgetMenu from './SpaceWidgetMenu.vue'
import { ESidebarSection } from '@/constants/ui';
import { useSpaceStore } from '@/stores/space';

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})

const spaceStore = useSpaceStore()
const spaceMenuRef = ref<InstanceType<typeof SpaceMenu>>()
const spaceWidgetMenuRef = ref<InstanceType<typeof SpaceWidgetMenu>>()

onMounted(async () => {
  window.addEventListener('beforeunload', handlePageRefresh)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handlePageRefresh)
})


function handlePageRefresh(e: BeforeUnloadEvent) {
  const isProduction = import.meta.env.PROD
  if (isProduction && spaceStore.isEditMode) {
    e.preventDefault()
    e.returnValue = ''
  }
}

</script>

<template>
  <div>
    <SpaceMenu
      v-if="spaceStore.sidebarOpenState[ESidebarSection.SPACE]"
      ref="spaceMenuRef"
      :spaceId="props.spaceId" />
    <SpaceWidgetMenu
      v-else-if="spaceStore.sidebarOpenState[ESidebarSection.WIDGET]"
      ref="spaceWidgetMenuRef"
      :spaceId="props.spaceId" />
  </div>
</template>

<style scoped>

</style>
