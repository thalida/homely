<script setup lang="ts">
import { GridLayout, GridItem } from 'grid-layout-plus'
import { useDropZone } from '@vueuse/core'
import SpaceMenu from './SpaceMenu.vue'
import SpaceWidget from './SpaceWidget.vue'
import { useSpaceStore } from '@/stores/space'
import { onMounted, ref } from 'vue'

const spaceStore = useSpaceStore()

const dropZoneRef = ref<HTMLDivElement>()
function onDrop(files: File[] | null) {
  console.log(files)
}
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

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
</script>

<template>
  <div
    ref="dropZoneRef"
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
