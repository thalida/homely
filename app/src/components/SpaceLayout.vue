<script setup lang="ts">
import { createVNode, onMounted, ref, render, watchEffect } from 'vue'
import { GridLayout, GridItem } from 'grid-layout-plus'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget'
import SpaceWidget from './SpaceWidget.vue'
import SpaceMenu from './SpaceMenu.vue'
import 'gridstack/dist/gridstack.min.css';
import { GridStack, type GridStackNode } from 'gridstack';

const spaceStore = useSpaceStore()
const widgetsStore = useWidgetStore()

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})

const MIN_ROW_HEIGHT = 100

const spaceRef = ref<HTMLElement>()
const spaceMenuRef = ref<InstanceType<typeof SpaceMenu>>()
const gridLayoutRef = ref<InstanceType<typeof GridLayout>>()
const gridLayoutSettings = ref({
  rowHeight: MIN_ROW_HEIGHT,
  columns: 12,
  margin: [12, 12],
})

let grid: GridStack | null = null;

onMounted(async () => {
  await spaceStore.fetchSpace(props.spaceId)
  grid = GridStack.init({
    column: 12,
    margin: 12,
    cellHeight: 100,
  })

  setGridEditability()

  grid.on('added', function(event: Event, items: GridStackNode[]) {
    for (const item of items) {
      const itemEl = item.el as HTMLElement
      const itemElContent = itemEl.querySelector('.grid-stack-item-content') as HTMLElement
      const widgetId = item.widget.uid
      const widgetNode = createVNode(SpaceWidget, { widgetId })
      render(widgetNode, itemElContent)
    }
  });

  grid.on('change', function(event: Event, items: GridStackNode[]) {
    for (const item of items) {
      const widgetId = item.widget.uid
      const widget = widgetsStore.getWidgetById(widgetId)
      if (!widget) continue

      widgetsStore.unselectAllWidgets(props.spaceId)
      widgetsStore.selectWidgetById(widgetId)
      widgetsStore.draftUpdateWidget(widgetId, {
        layout: {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        }
      })
    }
  });

  grid.load(widgetsStore.gridStackBySpace[props.spaceId])
})

function setGridEditability() {
  if (!grid) return

  if (spaceStore.isEditMode) {
    grid.enable()
  } else {
    grid.disable()
  }
}

function handleEditModeStart() {
  setGridEditability()
}

function handleEditModeStop() {
  setGridEditability()
}


// watchEffect(() => {
//     if (!gridLayoutRef.value) {
//       return
//     }

//     const gridWidth = gridLayoutRef.value.state.width
//     const rowHeight = (gridWidth / gridLayoutSettings.value.columns) - gridLayoutSettings.value.margin[0]
//     gridLayoutSettings.value.rowHeight = Math.max(rowHeight, MIN_ROW_HEIGHT)
// })

function handleSpaceClick(e: Event) {
  const target = e.target as HTMLElement
  const isGridElement = target.classList.contains('grid-layout')
  const isWrapper = target.classList.contains('space-layout')

  if (isGridElement || isWrapper) {
    widgetsStore.unselectAllWidgets(props.spaceId)
  }
}

// function handleGridItemClick(e:KeyboardEvent, widgetId: string) {
//   if (!spaceStore.isEditMode) {
//     return
//   }

//   e.stopPropagation()
//   e.preventDefault()
//   widgetsStore.unselectAllWidgets(props.spaceId)
//   widgetsStore.selectWidgetById(widgetId)
// }

// function handleGridItemMove(widgetId: string) {
//   widgetsStore.selectWidgetById(widgetId)
// }

// function handleGridItemMoved(widgetId: string, x: number, y: number) {
//   const widget = widgetsStore.getWidgetById(widgetId)
//   if (!widget) return

//   widgetsStore.draftUpdateWidget(widgetId, {
//     layout: { x, y }
//   })
// }

// function handleGridItemResized(widgetId: string, w: number, h: number) {
//   const widget = widgetsStore.getWidgetById(widgetId)
//   if (!widget) return

//   widgetsStore.draftUpdateWidget(widgetId, {
//     layout: { w, h }
//   })
// }
</script>

<template>
  <div
    ref="spaceRef"
    class="space-layout flex bg-white dark:bg-slate-900"
    @click="handleSpaceClick"
  >
    <div class="grid-stack grow shrink-0 w-full h-full"></div>
    <!-- <GridLayout
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
    </GridLayout> -->
    <SpaceMenu
      ref="spaceMenuRef"
      class="shrink-0"
      :spaceId="props.spaceId"
      @editModeStart="handleEditModeStart"
      @editModeStop="handleEditModeStop" />
  </div>
</template>

<style scoped>
.space-layout {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
</style>
<style>
.grid-stack>.grid-stack-item>.grid-stack-item-content {
  overflow: visible;
}
.grid-stack-item-content {
  overflow: visible;
}
</style>
