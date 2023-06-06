<script setup lang="ts">
import { provide, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import SpaceMenu from './SpaceMenu.vue'
import SpaceGrid from './SpaceGrid.vue'

const widgetsStore = useWidgetStore()

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})

const spaceRef = ref<HTMLElement>()
const spaceGridRef = ref<InstanceType<typeof SpaceGrid>>()
const spaceMenuRef = ref<InstanceType<typeof SpaceMenu>>()

function handleSpaceClick(e: Event) {
  const target = e.target as HTMLElement
  const isSpaceGrid = target.classList.contains('grid-stack')

  if (isSpaceGrid) {
    widgetsStore.unselectAllWidgets(props.spaceId)
  }
}

provide('spaceGridRef', spaceGridRef)
</script>

<template>
  <main
    ref="spaceRef"
    class="flex flex-row relative w-full h-full overflow-auto"
    @click="handleSpaceClick"
  >
    <SpaceGrid
      ref="spaceGridRef"
      :spaceId="props.spaceId" />
    <SpaceMenu
      ref="spaceMenuRef"
      :spaceId="props.spaceId" />
  </main>
</template>

<style scoped>
</style>
