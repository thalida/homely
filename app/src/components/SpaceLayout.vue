<script setup lang="ts">
import { type Ref, ref, reactive } from 'vue'
import Moveable, { type OnDrag, type OnResize  } from 'moveable'
import Selecto from 'selecto'
import SpaceWidget from './SpaceWidget.vue'

const isEditMode = ref(false)

interface IWidget {
  id: number
  content: string
  isSelected: boolean
  isSelectedGroup: boolean
  styles: {
    x: number
    y: number
    width: number
    height: number
  }
}
interface IWidgets {
  [key: number]: IWidget
}

const widgets: Ref<IWidgets> = ref({
  1: {
    id: 1,
    content: 'widget 1',
    isSelected: false,
    isSelectedGroup: false,
    styles: {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    }
  },
  2: {
    id: 2,
    content: 'widget 2',
    isSelected: false,
    isSelectedGroup: false,
    styles: {
      x: 100,
      y: 100,
      width: 200,
      height: 200
    }
  },
  3: {
    id: 3,
    content: 'widget 3',
    isSelected: false,
    isSelectedGroup: false,
    styles: {
      x: 300,
      y: 200,
      width: 200,
      height: 400
    }
  },
  4: {
    id: 4,
    content: 'widget 4',
    isSelected: false,
    isSelectedGroup: false,
    styles: {
      x: 400,
      y: 0,
      width: 200,
      height: 200
    }
  },
  5: {
    id: 5,
    content: 'widget 5',
    isSelected: false,
    isSelectedGroup: false,
    styles: {
      x: 750,
      y: 0,
      width: 300,
      height: 300
    }
  }
})
const widgetOrder: Ref<number[]> = ref([1, 2, 3, 4, 5])

const editCopy = reactive({
  widgets: {} as IWidgets,
  widgetOrder: [] as number[]
})

let moveable: Moveable | null = null
let selecto: Selecto | null = null
let targets: HTMLElement[] = []

function startEditMode() {
  editCopy.widgets = JSON.parse(JSON.stringify(widgets.value))
  editCopy.widgetOrder = [...widgetOrder.value]

  isEditMode.value = true

  const moveableContainer = document.querySelector('.space-layout__canvas') as HTMLElement
  const selectoContainer = document.querySelector('.space-layout__canvas__selecto') as HTMLElement
  targets = []

  moveable = new Moveable(moveableContainer, {
    target: targets,

    draggable: true,
    resizable: true,

    rotatable: false,
    scalable: false,
    warpable: false,
    pinchable: false,

    origin: false,
    keepRatio: true,
    edge: true,
    edgeDraggable: true,

    throttleDrag: 0,
    throttleResize: 0,

    snappable: true,
    isDisplaySnapDigit: true,
    snapThreshold: 10,
    maxSnapElementGuidelineDistance: undefined,
    elementGuidelines: targets,
    snapDirections: {
      top: true,
      left: true,
      bottom: true,
      right: true,
      center: true,
      middle: true
    },
    elementSnapDirections: {
      top: true,
      left: true,
      bottom: true,
      right: true,
      center: true,
      middle: true
    }
  })

  selecto = new Selecto({
    container: selectoContainer,
    dragContainer: moveableContainer,
    selectableTargets: ['.selecto-area .space-widget'],
    hitRate: 0,
    selectByClick: true,
    selectFromInside: false,
    toggleContinueSelect: ['shift'],
    ratio: 0
  })

  moveable.on('clickGroup', (e) => {
    selecto!.clickTarget(e.inputEvent, e.inputTarget)
  })
  moveable.on('drag', (e) => {
    setStyles(e)
  })
  moveable.on('dragGroup', (e) => {
    e.events.forEach((ev) => {
      setStyles(ev)
    })
  })
  moveable.on('resize', (e) => {
    setStyles(e)
  })
  moveable.on('resizeGroup', (e) => {
    e.events.forEach((ev) => {
      setStyles(ev)
    })
  })

  selecto.on('dragStart', (e) => {
    if (moveable === null) {
      return
    }
    const target = e.inputEvent.target
    const isMoveable = moveable.isMoveableElement(target)
    if (isMoveable || targets.some((t) => t === target || t.contains(target))) {
      e.stop()
    }
  })
  selecto.on('selectEnd', (e) => {
    if (moveable === null) {
      return
    }
    if (e.isDragStart) {
      e.inputEvent.preventDefault()
      moveable.waitToChangeTarget().then(() => {
        moveable?.dragStart(e.inputEvent)
      })
    }
    setTargets(e.selected as HTMLElement[])
  })
}

function stopEditMode() {
  isEditMode.value = false
  if (moveable) {
    moveable.destroy()
    moveable = null
  }
  if (selecto) {
    selecto.destroy()
    selecto = null
  }
  setTargets([])
  editCopy.widgets = {}
  editCopy.widgetOrder = []
}

async function resetEditMode() {
  widgets.value = JSON.parse(JSON.stringify(editCopy.widgets))
  widgetOrder.value = [...editCopy.widgetOrder]
}

function getElementWidgetId(element: HTMLElement) {
  const widgetId = element.dataset.widgetId
  if (!widgetId) {
    return
  }

  return parseInt(widgetId, 10)
}

function setStyles(e: OnDrag | OnResize) {
  const widgetId = getElementWidgetId(e.target as HTMLElement)
  if (!widgetId) {
    return
  }

  if ("translate" in e && Array.isArray(e.translate)) {
    widgets.value[widgetId].styles.x = e.translate[0]
    widgets.value[widgetId].styles.y = e.translate[1]
  }

  if (typeof e.width === 'number') {
    e.target.style.width = `${e.width}px`
    widgets.value[widgetId].styles.width = e.width
  }

  if (typeof e.height === 'number') {
    e.target.style.height = `${e.height}px`
    widgets.value[widgetId].styles.height = e.height
  }
}

function setTargets(nextTargets: HTMLElement[]) {
  const currentTargets = [...targets]
  targets = nextTargets

  if (moveable) {
    moveable.target = targets
    moveable.elementGuidelines = Array.from(
      document.querySelectorAll('.selecto-area .space-widget')
    ).filter((t) => !t.classList.contains('selected'))
  }

  for (const target of currentTargets) {
    const widgetId = getElementWidgetId(target)
    if (!widgetId) {
      continue
    }
    widgets.value[widgetId].isSelected = false
    widgets.value[widgetId].isSelectedGroup = false
  }

  const isGroup = targets.length > 1
  for (const target of targets) {
    const widgetId = getElementWidgetId(target)
    if (!widgetId) {
      continue
    }
    widgets.value[widgetId].isSelected = true
    widgets.value[widgetId].isSelectedGroup = isGroup
  }
}

function handleEditModeToggle() {
  isEditMode.value = !isEditMode.value
  if (isEditMode.value) {
    startEditMode()
  } else {
    stopEditMode()
  }
}

function handleCancelEdit() {
  resetEditMode()
  stopEditMode()
}
</script>

<template>
  <div class="space-layout">
    <div class="space-layout__menu">
      <button v-if="isEditMode" @click="handleCancelEdit">Cancel</button>
      <button @click="handleEditModeToggle">
        {{ isEditMode ? 'Done' : 'Edit' }}
      </button>
    </div>
    <div class="space-layout__canvas">
      <div class="space-layout__canvas__selecto"></div>
      <div class="elements selecto-area scroll-area">
        <SpaceWidget
          v-for="widgetId in widgetOrder"
          :data-widget-id="widgetId"
          class="space-widget"
          :key="widgetId"
          :widget="widgets[widgetId]"
        >
        </SpaceWidget>
      </div>
    </div>
  </div>
</template>

<style scoped>
.space-layout {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
.space-layout__menu {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: #eee;
  padding: 8px;
  border-bottom: 1px solid #ddd;
  width: 100%;
  height: 32px;
}
.space-layout__canvas {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 32px;
  left: 0;
}
</style>
