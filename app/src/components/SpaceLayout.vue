<script setup lang="ts">
import { h, onMounted, ref, render, watchEffect } from 'vue'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget'
import SpaceWidget from './SpaceWidget.vue'
import SpaceMenu from './SpaceMenu.vue'
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';
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
    margin: 12,
    cellHeight: 100 + (12 * 2),
    float: true,
    disableOneColumnMode: true,
    acceptWidgets: true,
    minRow: 1,
  })

  setGridEditability()

  grid.on('added', function(event: Event, items: GridStackNode[]) {
    for (const item of items) {
      const itemEl = item.el as HTMLElement
      const itemElContent = itemEl.querySelector('.grid-stack-item-content') as HTMLElement

      const isNewWidget = itemEl.dataset.isNewWidget === 'true'

      if (isNewWidget) {
        const newWidgetSettings = JSON.parse(itemEl.dataset.createWidget as string)

        if (!newWidgetSettings) {
          continue
        }

        newWidgetSettings.layout.x = item.x
        newWidgetSettings.layout.y = item.y
        newWidgetSettings.layout.w = item.w
        newWidgetSettings.layout.h = item.h

        widgetsStore.draftCreateWidget(props.spaceId, newWidgetSettings)
        return
      }

      const widgetId = item.id

      if (typeof widgetId === 'undefined') {
        continue
      }

      const widgetNode = h(SpaceWidget, { widgetId })
      render(widgetNode, itemElContent)
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

  grid.on('dragstop', function(event: Event, el: GridItemHTMLElement) {
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
  });

  grid.on('resizestart', function(event: Event, el: GridItemHTMLElement) {
    const widgetId = el.getAttribute('gs-id')

    if (!widgetId) {
      return
    }

    widgetsStore.unselectAllWidgets(props.spaceId)
    widgetsStore.selectWidgetById(widgetId)
  });

  grid.on('resizestop', function(event: Event, el: GridItemHTMLElement) {
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
  });

  function resizeGrid() {
    if (!grid) return

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
  };

  window.addEventListener('resize', resizeGrid);

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
