<script setup lang="ts">
import { GridLayout, GridItem } from 'grid-layout-plus'
import { useDropZone } from '@vueuse/core'
import SpaceMenu from './SpaceMenu.vue'
import SpaceWidget from './SpaceWidget.vue'
import { useSpaceStore } from '@/stores/space'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { throttle } from 'lodash'

const spaceStore = useSpaceStore()

const wrapper = ref<HTMLElement>()
const gridLayout = ref<InstanceType<typeof GridLayout>>()
function onDrop(files: File[] | null) {
  console.log(files)
}
const { isOverDropZone } = useDropZone(wrapper, onDrop)

onMounted(() => {
  if (spaceStore.isEditMode) {
    startEditMode({ storeBackup: false })
  }
})
function startEditMode({ storeBackup = true } = {}) {
  spaceStore.setEditMode(true)

  if (storeBackup) {
    spaceStore.widgets.createBackup()
  }
}

function stopEditMode() {
  spaceStore.setEditMode(false)
  spaceStore.widgets.deleteBackup()
  spaceStore.widgets.updateAllWidgets({ state: { selected: false } })
}

function cancelEditMode() {
  spaceStore.widgets.resetFromBackup()
  stopEditMode()
}

function handlePaste(e: ClipboardEvent) {
  console.log(e)
  const clipboardData = e.clipboardData
  if (!clipboardData) {
    return
  }

  console.log(clipboardData.getData('text/plain'))
}

function handleLayoutClick() {
  if (!spaceStore.isEditMode) {
    return
  }

  spaceStore.widgets.updateAllWidgets({ state: { selected: false } })
}

function handleGridItemClick(e:KeyboardEvent, item: any) {
  if (!spaceStore.isEditMode) {
    return
  }

  e.stopPropagation()

  const isShiftPressed = e.shiftKey
  const selected = !spaceStore.widgets.collection[item.i].state.selected

  if (!isShiftPressed) {
    spaceStore.widgets.updateAllWidgets({ state: { selected: false } })
  }

  spaceStore.widgets.updateWidget(item.i, { state: { selected } })
}

function handleGridItemMove(itemId: string) {
  spaceStore.widgets.updateWidget(itemId, { state: { selected: true } })
}
</script>

<template>
  <div
    ref="wrapper"
    class="space-layout"
    @paste="handlePaste"
    @click="handleLayoutClick"
  >
    <SpaceMenu
      @editModeStart="startEditMode"
      @editModeDone="stopEditMode"
      @editModeCancel="cancelEditMode"
    />

    <GridLayout
      ref="gridLayout"
      class="grid-layout"
      v-model:layout="spaceStore.widgets.layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="spaceStore.isEditMode"
      :is-resizable="false"
      :vertical-compact="false"
      :restore-on-drag="true"
      :prevent-collision="true"
    >
      <GridItem
        v-for="item in spaceStore.widgets.layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @click="handleGridItemClick($event, item)"
        @move="handleGridItemMove"
      >
        <SpaceWidget :widget-id="item.i" />
      </GridItem>
    </GridLayout>
  </div>
</template>

<style scoped>
.space-layout {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
</style>
