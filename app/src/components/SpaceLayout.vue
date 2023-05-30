<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget'
import SpaceMenu from './SpaceMenu.vue'
import GridStack from './GridStack.vue'
import type { GridStackNode, GridItemHTMLElement } from 'gridstack';
import { debounce } from 'lodash'

const spaceStore = useSpaceStore()
const widgetsStore = useWidgetStore()

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})

const spaceRef = ref<HTMLElement>()
const gridStackRef = ref<InstanceType<typeof GridStack>>()
const spaceMenuRef = ref<InstanceType<typeof SpaceMenu>>()

const gridStackOptions = {
  margin: 12,
  cellHeight: 100 + (12 * 2),
  float: true,
  disableOneColumnMode: true,
  acceptWidgets: true,
  minRow: 1,
}

const isDraggingWidget = ref(false)
const isResizingWidget = ref(false)
const isResizingWindow = ref(false)

onMounted(async () => {
  await spaceStore.fetchSpace(props.spaceId)

  watchEffect(() => {
    gridStackRef.value?.getGrid()?.load(widgetsStore.gridStackBySpace[props.spaceId])
  })

  window.addEventListener('resize', resizeGrid);
})

function resizeGrid() {
  let grid = gridStackRef.value?.getGrid()

  if (!grid) return

  isResizingWindow.value = true

  let width = document.body.clientWidth;
  const layout = 'move'
  if (width < 700) {
    grid.column(1, layout);
  } else if (width < 850) {
    grid.column(3, layout);
  } else if (width < 950) {
    grid.column(6, layout);
  } else if (width < 1100) {
    grid.column(8, layout);
  } else {
    grid.column(12, layout);
  }

  debouceResizeEnd()
};

function resizeEnd () {
  isResizingWindow.value = false
}

const debouceResizeEnd = debounce(resizeEnd, 200)

function handleSpaceClick(e: Event) {
  const target = e.target as HTMLElement
  const isGridElement = target.classList.contains('grid-layout')
  const isWrapper = target.classList.contains('space-layout')

  if (isGridElement || isWrapper) {
    widgetsStore.unselectAllWidgets(props.spaceId)
  }
}

function handleGridDragStart(event: Event, el: GridItemHTMLElement) {
  const widgetId = el.getAttribute('gs-id')

  if (!widgetId) {
    return
  }

  isDraggingWidget.value = true
  widgetsStore.unselectAllWidgets(props.spaceId)
  widgetsStore.selectWidgetById(widgetId)
}

function handleGridDragStop(event: Event, el: GridItemHTMLElement) {
  if (!el.gridstackNode) {
    isDraggingWidget.value = false
    return
  }

  const node: GridStackNode = el.gridstackNode;

  if (!node.id) {
    isDraggingWidget.value = false
    return
  }

  widgetsStore.draftUpdateWidget(node.id, {
    layout: {
      x: node.x,
      y: node.y,
      w: node.w,
      h: node.h,
    }
  })
  isDraggingWidget.value = false
}

function handleGridResizeStart(event: Event, el: GridItemHTMLElement) {
    const widgetId = el.getAttribute('gs-id')

  if (!widgetId) {
    return
  }

  isResizingWidget.value = true
  widgetsStore.unselectAllWidgets(props.spaceId)
  widgetsStore.selectWidgetById(widgetId)
}

function handleGridResizeStop(event: Event, el: GridItemHTMLElement) {
  if (!el.gridstackNode) {
    isResizingWidget.value = false
    return
  }

  const node: GridStackNode = el.gridstackNode;

  if (!node.id) {
    isResizingWidget.value = false
    return
  }

  widgetsStore.draftUpdateWidget(node.id, {
    layout: {
      x: node.x,
      y: node.y,
      w: node.w,
      h: node.h,
    }
  })
  isResizingWidget.value = false
}

function handleGridDropped(event: Event, previousWidget: GridStackNode, newWidget: GridStackNode) {
  if (typeof newWidget === 'undefined' || newWidget === null) {
    return
  }

  const newWidgetEl = newWidget.el as HTMLElement
  const newWidgetSettings = JSON.parse(newWidgetEl.dataset.createWidget as string)

  if (!newWidgetSettings) {
    return
  }

  newWidgetSettings.layout.x = newWidget.x
  newWidgetSettings.layout.y = newWidget.y
  newWidgetSettings.layout.w = newWidget.w
  newWidgetSettings.layout.h = newWidget.h

  widgetsStore.draftCreateWidget(props.spaceId, newWidgetSettings)
}

function handleGridChange(event: Event, items: GridStackNode[]) {
  if (isResizingWindow.value) {
    return
  }

  for (const item of items) {
    if (!item.id) {
      continue
    }

    widgetsStore.draftUpdateWidget(item.id, {
      layout: {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      }
    })
  }
}
</script>

<template>
  <div
    ref="spaceRef"
    class="space-layout flex bg-white dark:bg-slate-900"
    :class="{
      'is-editing': spaceStore.isEditMode,
    }"
    @click="handleSpaceClick"
  >
    <GridStack
      ref="gridStackRef"
      :editable="spaceStore.isEditMode"
      :options="gridStackOptions"
      @dragstart="handleGridDragStart"
      @dragstop="handleGridDragStop"
      @resizestart="handleGridResizeStart"
      @resizestop="handleGridResizeStop"
      @dropped="handleGridDropped"
      @change="handleGridChange" />
    <SpaceMenu
      ref="spaceMenuRef"
      class="shrink-0"
      :spaceId="props.spaceId" />
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
.is-editing .grid-stack{
  margin-right: 320px;
  margin-bottom: 320px;
}
.grid-stack>.grid-stack-item>.grid-stack-item-content {
  overflow: visible;
}
.grid-stack-item-content {
  overflow: visible;
}
</style>
