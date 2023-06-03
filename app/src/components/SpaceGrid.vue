<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { debounce } from 'lodash'
import type { GridStackNode, GridItemHTMLElement } from 'gridstack';
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget'
import GridStack from './GridStack.vue'

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})
const spaceStore = useSpaceStore()
const widgetsStore = useWidgetStore()
const gridStackRef = ref<InstanceType<typeof GridStack>>()
const gridStackOptions = {
  margin: 12,
  cellHeight: 100 + (12 * 2),
  float: true,
  disableOneColumnMode: true,
  acceptWidgets: true,
  minRow: 1,
}
const isResizingWindow = ref(false)

defineExpose({
  gridStackRef,
})

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

  debouceOnResizeEnd()
};

function resizeEnd () {
  isResizingWindow.value = false
}

const debouceOnResizeEnd = debounce(resizeEnd, 200)

function handleGridDragStart(event: Event, el: GridItemHTMLElement) {
  const widgetId = el.getAttribute('gs-id')

  if (!widgetId) {
    return
  }

  widgetsStore.unselectAllWidgets(props.spaceId)
  widgetsStore.selectWidgetById(widgetId)
}

function handleGridDragStop(event: Event, el: GridItemHTMLElement) {
  if (!el.gridstackNode) {
    return
  }

  const node: GridStackNode = el.gridstackNode;

  if (!node.id) {
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
}

function handleGridResizeStart(event: Event, el: GridItemHTMLElement) {
    const widgetId = el.getAttribute('gs-id')

  if (!widgetId) {
    return
  }

  widgetsStore.unselectAllWidgets(props.spaceId)
  widgetsStore.selectWidgetById(widgetId)
}

function handleGridResizeStop(event: Event, el: GridItemHTMLElement) {
  if (!el.gridstackNode) {
    return
  }

  const node: GridStackNode = el.gridstackNode;

  if (!node.id) {
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

    console.log(item, item.x, item.y, item.w, item.h)

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
</template>

<style>
.grid-stack > .grid-stack-item > .grid-stack-item-content {
  overflow: visible;
}
</style>
