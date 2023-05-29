<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { throttle } from 'lodash'
import { GridLayout, GridItem } from 'grid-layout-plus'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget'
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

const MIN_ROW_HEIGHT = 100

const isReady = ref(false)
const spaceRef = ref<HTMLElement>()
const spaceMenuRef = ref<InstanceType<typeof SpaceMenu>>()
const gridLayoutRef = ref<InstanceType<typeof GridLayout>>()
const gridLayoutSettings = ref({
  rowHeight: MIN_ROW_HEIGHT,
  columns: 12,
  margin: [12, 12],
})


onMounted(async () => {
  await spaceStore.fetchSpace(props.spaceId)
  isReady.value = true
})

watchEffect(() => {
    if (!gridLayoutRef.value) {
      return
    }

    const gridWidth = gridLayoutRef.value.state.width
    const rowHeight = (gridWidth / gridLayoutSettings.value.columns) - gridLayoutSettings.value.margin[0]
    gridLayoutSettings.value.rowHeight = Math.max(rowHeight, MIN_ROW_HEIGHT)
})

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
</script>

<template>
  <div
    ref="spaceRef"
    class="space-layout flex bg-white dark:bg-slate-900"
    @click="handleSpaceClick"
  >
    <GridLayout
      v-if="isReady && spaceMenuRef"
      ref="gridLayoutRef"
      class="grid-layout grow shrink-0 w-full h-full"
      :class="{
        'mr-80 mb-32': spaceStore.isEditMode,
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
    <SpaceMenu v-if="isReady" ref="spaceMenuRef" class="shrink-0" :spaceId="props.spaceId" />
  </div>
</template>

<style scoped>
.space-layout {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}

.grid-layout {
  min-width: 1024px;
}
</style>
