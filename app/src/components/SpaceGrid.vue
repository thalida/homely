<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { debounce } from 'lodash'
import type { GridStackNode, GridItemHTMLElement } from 'gridstack';
import { useWidgetStore } from '@/stores/widget'
import GridStack from './GridStack.vue'

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})
const widgetStore = useWidgetStore()
const gridStackRef = ref<InstanceType<typeof GridStack>>()
const gridStackOptions = {
  margin: 12,
  cellHeight: 100 + (12 * 2),
  animate: false,
  float: true,
  disableOneColumnMode: true,
  acceptWidgets: true,
  minRow: 1,
}
const isResizingGrid = ref(false)

defineExpose({
  gridStackRef,
})

onMounted(async () => {
  window.addEventListener('resize', handleWindowResize);
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleWindowResize);
})

watchEffect(() => {
  if (!widgetStore.gridStackBySpace[props.spaceId]) {
    return
  }

  gridStackRef.value?.getGrid()?.load(widgetStore.gridStackBySpace[props.spaceId])
})

watchEffect(() => {
  resizeGrid(widgetStore.isEditing[props.spaceId])
})

function handleWindowResize() {
  resizeGrid(widgetStore.isEditing[props.spaceId])
}

function resizeGrid(isWidgetEditMode: boolean = false) {
  let grid = gridStackRef.value?.getGrid()

  if (!grid) return

  const layout = 'move'
  isResizingGrid.value = true

  if (isWidgetEditMode) {
    grid.column(12, layout);
    isResizingGrid.value = false
    return
  }

  let width = document.body.clientWidth;
  if (width < 500) {
    grid.column(1, layout);
  } else if (width < 950) {
    grid.column(6, layout);
  } else {
    grid.column(12, layout);
  }

  debouceOnResizeEnd()
};

function resizeEnd () {
  isResizingGrid.value = false
}

const debouceOnResizeEnd = debounce(resizeEnd, 200)

function handleGridDragStart(event: Event, el: GridItemHTMLElement) {
  const widgetId = el.getAttribute('gs-id')

  if (!widgetId) {
    return
  }

  widgetStore.unselectAllWidgets(props.spaceId)
  widgetStore.selectWidgetById(widgetId)
}

function handleGridDragStop(event: Event, el: GridItemHTMLElement) {
  if (!el.gridstackNode) {
    return
  }

  const node: GridStackNode = el.gridstackNode;

  if (!node.id) {
    return
  }

  widgetStore.draftUpdateWidget(node.id, {
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

  widgetStore.unselectAllWidgets(props.spaceId)
  widgetStore.selectWidgetById(widgetId)
}

function handleGridResizeStop(event: Event, el: GridItemHTMLElement) {
  if (!el.gridstackNode) {
    return
  }

  const node: GridStackNode = el.gridstackNode;

  if (!node.id) {
    return
  }

  widgetStore.draftUpdateWidget(node.id, {
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

  widgetStore.draftCreateWidget(props.spaceId, newWidgetSettings)
}

function handleGridChange(event: Event, items: GridStackNode[]) {
  if (isResizingGrid.value || !widgetStore.isEditing[props.spaceId]) {
    return
  }

  for (const item of items) {
    if (!item.id) {
      continue
    }

    widgetStore.draftUpdateWidget(item.id, {
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
  <div class="overflow-auto grow">
    <GridStack
      ref="gridStackRef"
      :editable="widgetStore.isEditing[props.spaceId]"
      :options="gridStackOptions"
      @dragstart="handleGridDragStart"
      @dragstop="handleGridDragStop"
      @resizestart="handleGridResizeStart"
      @resizestop="handleGridResizeStop"
      @dropped="handleGridDropped"
      @change="handleGridChange" />
  </div>
</template>

<style>
.grid-stack > .grid-stack-item > .grid-stack-item-content {
  overflow: visible;
}
</style>
