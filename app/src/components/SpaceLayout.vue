<script setup lang="ts">
import { provide, ref } from 'vue'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget'
import SpaceMenu from './SpaceMenu.vue'
import SpaceGrid from './SpaceGrid.vue'

const spaceStore = useSpaceStore()
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
  const isSpaceLayout = target.classList.contains('space-layout')
  const isSpaceGrid = target.classList.contains('space-layout__grid')

  if (isSpaceGrid || isSpaceLayout) {
    widgetsStore.unselectAllWidgets(props.spaceId)
  }
}

provide('spaceGridRef', spaceGridRef)
</script>

<template>
  <div
    ref="spaceRef"
    class="space-layout flex relative"
    :class="{
      'is-editing': spaceStore.isEditMode,
    }"
    @click="handleSpaceClick"
  >
    <SpaceGrid
      ref="spaceGridRef"
      class="space-layout__grid"
      :spaceId="props.spaceId" />
    <SpaceMenu
      ref="spaceMenuRef"
      class="space-layout__menu shrink-0"
      :spaceId="props.spaceId" />
  </div>
</template>

<style scoped>
.space-layout {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
.is-editing .space-layout__grid {
  margin-right: 320px;
}

</style>
