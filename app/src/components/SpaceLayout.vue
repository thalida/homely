<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { cloneDeep, throttle } from 'lodash'
import { GridLayout, GridItem } from 'grid-layout-plus'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget'
import type { IWidget, IWidgetButton } from '@/types/widget'
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

  isReady.value = true
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', throttle(setRowHeight))
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
  widgetsStore.saveDirtyWidgets(props.spaceId)
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

function handleGridItemMoved(widgetId: string, x: number, y: number) {
  const widget = widgetsStore.getWidgetById(widgetId)
  if (!widget) return

  widgetsStore.draftUpdateWidget(widgetId, {
    layout: { x, y }
  })
}

function handleGridItemResized(widgetId: string, w: number, h: number) {
  const widget = widgetsStore.getWidgetById(widgetId)
  if (!widget) return

  widgetsStore.draftUpdateWidget(widgetId, {
    layout: { w, h }
  })
}

async function handleAddModule(event: Event, widgetButton: IWidgetButton) {
  const maxPosition = widgetsStore.maxLayoutPositionBySpace[props.spaceId]
  const newWidgetInput: IWidget = cloneDeep(widgetButton) as IWidget
  newWidgetInput.layout.x = maxPosition.x
  newWidgetInput.layout.y = maxPosition.y

  const widget = widgetsStore.draftCreateWidget(props.spaceId, newWidgetInput)

  await nextTick()
  await nextTick()

  const widgetElement = document.getElementById(`space-widget-${widget.uid}`)
  if (!widgetElement) {
    return
  }

  widgetElement.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
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
      :is-bounded="false"
      :vertical-compact="false"
      :restore-on-drag="false"
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
        @resized="handleGridItemResized"
      >
        <SpaceWidget :id="`space-widget-${widgetId}`" :widget-id="widgetId" />
      </GridItem>
    </GridLayout>
    <SpaceMenu
      class="shrink-0"
      :spaceId="props.spaceId"
      @editModeStart="startEditMode"
      @editModeDone="stopEditMode"
      @editModeCancel="cancelEditMode"
      @addModule="handleAddModule"
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
