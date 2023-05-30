<script setup lang="ts">
import { h, onMounted, ref, render, watchEffect } from 'vue'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget'
import SpaceWidget from './SpaceWidget.vue'
import SpaceMenu from './SpaceMenu.vue'
import 'gridstack/dist/gridstack.min.css';
import { GridStack, type GridStackNode, type GridItemHTMLElement } from 'gridstack';

const spaceStore = useSpaceStore()
const widgetsStore = useWidgetStore()

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})

const spaceRef = ref<HTMLElement>()
const spaceMenuRef = ref<InstanceType<typeof SpaceMenu>>()

let grid: GridStack | null = null;

onMounted(async () => {
  await spaceStore.fetchSpace(props.spaceId)
  grid = GridStack.init({
    column: 12,
    margin: 12,
    cellHeight: 'auto',
  })

  setGridEditability()

  grid.on('added', function(event: Event, items: GridStackNode[]) {
    for (const item of items) {
      const itemEl = item.el as HTMLElement
      const itemElContent = itemEl.querySelector('.grid-stack-item-content') as HTMLElement

      const widgetId = item.id

      if (typeof widgetId === 'undefined') {
        continue
      }

      const widgetNode = h(SpaceWidget, { widgetId })
      render(widgetNode, itemElContent)
    }
  });

  grid.on('change', function(event: Event, items: GridStackNode[]) {
    for (const item of items) {
      const widgetId = item.id

      if (typeof widgetId === 'undefined') {
        continue
      }

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

  grid.on('dragstart', function(event: Event, el: GridItemHTMLElement) {
    const widgetId = el.getAttribute('gs-id')

    if (!widgetId) {
      return
    }

    widgetsStore.unselectAllWidgets(props.spaceId)
    widgetsStore.selectWidgetById(widgetId)
  });

  grid.on('resizestart', function(event: Event, el: GridItemHTMLElement) {
    const widgetId = el.getAttribute('gs-id')

    if (!widgetId) {
      return
    }

    widgetsStore.unselectAllWidgets(props.spaceId)
    widgetsStore.selectWidgetById(widgetId)
  });

  watchEffect(() => {
    grid?.load(widgetsStore.gridStackBySpace[props.spaceId])
  })
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

function handleSpaceClick(e: Event) {
  const target = e.target as HTMLElement
  const isGridElement = target.classList.contains('grid-layout')
  const isWrapper = target.classList.contains('space-layout')

  if (isGridElement || isWrapper) {
    widgetsStore.unselectAllWidgets(props.spaceId)
  }
}
</script>

<template>
  <div
    ref="spaceRef"
    class="space-layout flex bg-white dark:bg-slate-900"
    @click="handleSpaceClick"
  >
    <div class="grid-stack grow shrink-0 w-full h-full"></div>
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
