<script setup lang="ts">
import { GridLayout, GridItem } from 'grid-layout-plus'
import SpaceMenu from './SpaceMenu.vue'
import SpaceWidget from './SpaceWidget.vue'
import { useSpaceStore } from '@/stores/space'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { throttle } from 'lodash'
import { EWidgetType, type IWidget, type IWidgetLayout } from '@/stores/widget'

const spaceStore = useSpaceStore()

const isReady = ref(false)
const spaceRef = ref<HTMLElement>()
const gridLayoutRef = ref<InstanceType<typeof GridLayout>>()

onMounted(() => {
  if (spaceStore.isEditMode) {
    startEditMode({ storeBackup: false })
  }

  document.addEventListener('dragover', syncMousePosition)

  isReady.value = true
})
onBeforeUnmount(() => {
  document.removeEventListener('dragover', syncMousePosition)
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

const mouseAt = { x: -1, y: -1 }
const TMP_WIDGET_ID = 'tmp-widget'
let tmpWidget: IWidget | null = null
let tmpWidgetLayout: IWidgetLayout | null = null

function syncMousePosition(event: MouseEvent) {
  mouseAt.x = event.clientX
  mouseAt.y = event.clientY
}

function isMouseInGrid() {
  const parentRect = spaceRef.value?.getBoundingClientRect()
  if (!parentRect) {
    return false
  }

  return (
    mouseAt.x > parentRect.left &&
    mouseAt.x < parentRect.right &&
    mouseAt.y > parentRect.top &&
    mouseAt.y < parentRect.bottom
  )
}

function cleanupTmpWidgetStore({ x, y, w, h}: { x: number, y: number, w: number, h: number }) {
  if (!gridLayoutRef.value) return

  gridLayoutRef.value.dragEvent('dragend', TMP_WIDGET_ID, x, y, h, w)
  spaceStore.widgets.layout = spaceStore.widgets.layout.filter(item => item.i !== TMP_WIDGET_ID)
  delete spaceStore.widgets.collection[TMP_WIDGET_ID]
}

function cleanupTmpWidgetSettings() {
  tmpWidget = null
  tmpWidgetLayout = null
}

const handleAddModuleDrag = throttle((_, widgetType) => {
  const parentRect = spaceRef.value?.getBoundingClientRect()

  if (!parentRect || !gridLayoutRef.value) return

  const mouseInGrid = isMouseInGrid()

  if (mouseInGrid) {
    const hasTmpWidget = TMP_WIDGET_ID in spaceStore.widgets.collection
    if (!hasTmpWidget) {
      tmpWidget = {
        id: TMP_WIDGET_ID,
        type: widgetType,
        content: {},
        state: {
          temporary: true,
          selected: false
        }
      }
      spaceStore.widgets.collection[TMP_WIDGET_ID] = tmpWidget
    }

    const hasTmpWidgetLayout = spaceStore.widgets.layout.some(item => item.i === TMP_WIDGET_ID)
    if (!hasTmpWidgetLayout) {
      tmpWidgetLayout = {
        x: (spaceStore.widgets.layout.length * 2) % 12,
        y: spaceStore.widgets.layout.length + 12,
        w: 2,
        h: 2,
        i: TMP_WIDGET_ID
      }
      spaceStore.widgets.layout.push(tmpWidgetLayout)
    }
  }

  if (tmpWidgetLayout === null) {
    return
  }

  const index = spaceStore.widgets.layout.findIndex(item => item.i === TMP_WIDGET_ID)

  if (index === -1) return

  const item = gridLayoutRef.value.getItem(TMP_WIDGET_ID)

  if (!item) return

  item.wrapper.style.display = 'none'

  Object.assign(item.state, {
    top: mouseAt.y - parentRect.top,
    left: mouseAt.x - parentRect.left
  })

  const newPos = item.calcXY(mouseAt.y - parentRect.top, mouseAt.x - parentRect.left)

  if (!mouseInGrid) {
    cleanupTmpWidgetStore({
      x: newPos.x,
      y: newPos.y,
      w: tmpWidgetLayout.w,
      h: tmpWidgetLayout.h
    })
    return
  }

  gridLayoutRef.value.dragEvent('dragstart', TMP_WIDGET_ID, newPos.x, newPos.y, tmpWidgetLayout.h, tmpWidgetLayout.w)
  tmpWidgetLayout.i = TMP_WIDGET_ID
  tmpWidgetLayout.x = spaceStore.widgets.layout[index].x
  tmpWidgetLayout.y = spaceStore.widgets.layout[index].y
})

function handleAddModuleDragEnd() {
  if (!gridLayoutRef.value || !isMouseInGrid() || tmpWidgetLayout === null) return

  cleanupTmpWidgetStore(tmpWidgetLayout)

  const { widget, layout } = spaceStore.widgets.createWidget({
    type: tmpWidget?.type || EWidgetType.TEXT,
    content: null,
  }, {
    x: tmpWidgetLayout.x,
    y: tmpWidgetLayout.y,
    w: tmpWidgetLayout.w,
    h: tmpWidgetLayout.h,
  })
  gridLayoutRef.value.dragEvent('dragend', widget.id, layout.x, layout.y, layout.h, layout.w)

  cleanupTmpWidgetSettings()

  const item = gridLayoutRef.value.getItem(widget.id)

  if (!item) return

  item.wrapper.style.display = ''
}
</script>

<template>
  <div
    ref="spaceRef"
    class="space-layout"
    @paste="handlePaste"
    @click="handleLayoutClick"
  >
    <SpaceMenu
      @editModeStart="startEditMode"
      @editModeDone="stopEditMode"
      @editModeCancel="cancelEditMode"
      @addModuleDrag="handleAddModuleDrag"
      @addModuleDragEnd="handleAddModuleDragEnd"
    />

    <div id="space__widget-menu"></div>

    <GridLayout
      v-if="isReady"
      ref="gridLayoutRef"
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
