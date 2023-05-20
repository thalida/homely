<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { cloneDeep, throttle } from 'lodash'
import { GridLayout, GridItem } from 'grid-layout-plus'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget'
import type { IWidget, IWidgetButton, IWidgetLayout } from '@/types/widget'
import SpaceWidget from './SpaceWidget.vue'
import SpaceMenu from './SpaceMenu.vue'

const spaceStore = useSpaceStore()
const widgetsStore = useWidgetStore()

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})

const widgets = computed(() => {
  return widgetsStore.activeWidgetsBySpace[props.spaceId] || []
})
const isReady = ref(false)
const spaceRef = ref<HTMLElement>()
const gridLayoutRef = ref<InstanceType<typeof GridLayout>>()
const gridLayoutSettings = ref({
  rowHeight: 32,
  columns: 12,
  margin: [12, 12],
})


onMounted(async () => {
  await spaceStore.fetchSpace(props.spaceId)
  setRowHeight()

  if (spaceStore.isEditMode) {
    startEditMode()
  }

  window.addEventListener('resize', throttle(setRowHeight))
  document.addEventListener('dragover', syncMousePosition)

  isReady.value = true
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', throttle(setRowHeight))
  document.removeEventListener('dragover', syncMousePosition)
})

function setRowHeight() {
  if (!spaceRef.value) {
    return
  }

  const parentRect = spaceRef.value.getBoundingClientRect()
  gridLayoutSettings.value.rowHeight = (parentRect.width / gridLayoutSettings.value.columns) - gridLayoutSettings.value.margin[0]
}

function startEditMode() {
  spaceStore.setEditMode(true)
  spaceStore.createBackup()
}

function stopEditMode() {
  widgetsStore.saveDraftWidgets(props.spaceId)
  spaceStore.setEditMode(false)
  spaceStore.deleteBackup()
  widgetsStore.unselectAllWidgets(props.spaceId)
}

function cancelEditMode() {
  spaceStore.resetFromBackup()
  stopEditMode()
}


function handleSpaceClick(e: Event) {
  const target = e.target as HTMLElement
  const isGridElement = target.classList.contains('grid-layout')
  const isWrapper = target.classList.contains('space-layout')

  if (isGridElement || isWrapper) {
    widgetsStore.unselectAllWidgets(props.spaceId)
  }
}

function handleGridItemClick(e:KeyboardEvent, widgetId: string) {
  if (!spaceStore.isEditMode) {
    return
  }

  e.stopPropagation()
  e.preventDefault()
  widgetsStore.unselectAllWidgets(props.spaceId)
  widgetsStore.selectWidgetById(widgetId)
}

function handleGridItemMove(widgetId: string) {
  widgetsStore.selectWidgetById(widgetId)
}

const mouseAt = { x: -1, y: -1 }
const TMP_WIDGET_ID = 'tmp-widget'
const tmpWidget = ref<IWidget | null>(null)

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
  delete widgetsStore.collection[TMP_WIDGET_ID]
}

function cleanupTmpWidgetSettings() {
  tmpWidget.value = null
}

const handleAddModuleDrag = throttle((_, widgetButton: IWidgetButton) => {
  const parentRect = spaceRef.value?.getBoundingClientRect()

  if (!parentRect || !gridLayoutRef.value) return

  const mouseInGrid = isMouseInGrid()

  if (mouseInGrid) {
    const hasTmpWidget = widgets.value.indexOf(TMP_WIDGET_ID) !== -1
    if (!hasTmpWidget) {
      tmpWidget.value = {
        uid: TMP_WIDGET_ID,
        space: props.spaceId,
        state: {
          temporary: true,
          draft: true,
          selected: false,
          deleted: false,
        },
        ...widgetButton
      }
      tmpWidget.value.layout.i = TMP_WIDGET_ID
      tmpWidget.value.layout.x = (widgets.value.length * 2) % 12
      tmpWidget.value.layout.y = widgets.value.length + 12
      widgetsStore.collection[TMP_WIDGET_ID] = tmpWidget.value
    }
  }

  if (widgetsStore.collection[TMP_WIDGET_ID] === null || tmpWidget.value === null) return

  const index = widgets.value.indexOf(TMP_WIDGET_ID)

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
      w: tmpWidget.value.layout.w,
      h: tmpWidget.value.layout.h
    })
    return
  }

  gridLayoutRef.value.dragEvent('dragstart', TMP_WIDGET_ID, newPos.x, newPos.y,  tmpWidget.value.layout.h,  tmpWidget.value.layout.w)
  tmpWidget.value.layout.i = TMP_WIDGET_ID
  tmpWidget.value.layout.x = widgetsStore.collection[TMP_WIDGET_ID].layout.x
  tmpWidget.value.layout.y = widgetsStore.collection[TMP_WIDGET_ID].layout.y
})

function handleAddModuleDragEnd(e: Event, widgetButton: IWidgetButton) {
  if (!gridLayoutRef.value || !isMouseInGrid() || widgetsStore.collection[TMP_WIDGET_ID] === null) return

  const newWidgetInput = cloneDeep(widgetButton)
  newWidgetInput.layout.x = widgetsStore.collection[TMP_WIDGET_ID].layout.x
  newWidgetInput.layout.y = widgetsStore.collection[TMP_WIDGET_ID].layout.y

  cleanupTmpWidgetStore(widgetsStore.collection[TMP_WIDGET_ID].layout)
  cleanupTmpWidgetSettings()

  const widget = widgetsStore.draftCreateWidget(props.spaceId, newWidgetInput)
  gridLayoutRef.value.dragEvent('dragend', widget.uid, widget.layout.x, widget.layout.y, widget.layout.h, widget.layout.w)

  const item = gridLayoutRef.value.getItem(widget.uid)

  if (!item) return

  item.wrapper.style.display = ''
}

function handleGridItemMoved(widgetId: string, x: number, y: number) {
  const widget = widgetsStore.getWidgetById(widgetId)
  if (!widget) return

  widgetsStore.draftUpdateWidget(widgetId, {
    layout: { x, y }
  })
}
</script>

<template>
  <div
    ref="spaceRef"
    class="space-layout flex"
    @click="handleSpaceClick"
  >
    <GridLayout
      v-if="isReady"
      ref="gridLayoutRef"
      class="grid-layout grow shrink-0 w-full h-full"
      :class="{
        'mr-80': spaceStore.isEditMode,
      }"
      v-model:layout="widgetsStore.layoutsBySpace[props.spaceId]"
      :col-num="gridLayoutSettings.columns"
      :row-height="gridLayoutSettings.rowHeight"
      :margin="gridLayoutSettings.margin"
      :is-draggable="spaceStore.isEditMode"
      :responsive="false"
      :is-resizable="false"
      :vertical-compact="false"
      :restore-on-drag="true"
      :prevent-collision="true"
    >
      <GridItem
        v-for="widgetId in widgetsStore.activeWidgetsBySpace[props.spaceId]"
        :key="widgetId"
        :x="widgetsStore.collection[widgetId].layout.x"
        :y="widgetsStore.collection[widgetId].layout.y"
        :w="widgetsStore.collection[widgetId].layout.w"
        :h="widgetsStore.collection[widgetId].layout.h"
        :i="widgetId"
        :preserve-aspect-ratio="widgetsStore.collection[widgetId].layout.preserveAspectRatio"
        :is-resizable="spaceStore.isEditMode && widgetsStore.collection[widgetId].layout.isResizable"
        @click="handleGridItemClick($event, widgetId)"
        @move="handleGridItemMove"
        @moved="handleGridItemMoved"
      >
        <SpaceWidget :widget-id="widgetId" />
      </GridItem>
    </GridLayout>

    <SpaceMenu
      class="shrink-0"
      :spaceId="props.spaceId"
      @editModeStart="startEditMode"
      @editModeDone="stopEditMode"
      @editModeCancel="cancelEditMode"
      @addModuleDrag="handleAddModuleDrag"
      @addModuleDragEnd="handleAddModuleDragEnd"
    />
  </div>
</template>

<style scoped>
.space-layout {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
</style>
