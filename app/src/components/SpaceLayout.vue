<script setup lang="ts">
import Moveable, { type OnDrag, type OnResize  } from 'moveable'
import Selecto from 'selecto'
import { useDropZone } from '@vueuse/core'
import SpaceMenu from './SpaceMenu.vue'
import SpaceWidget from './SpaceWidget.vue'
import { useSpaceStore } from '@/stores/space'
import { computed, nextTick, onMounted, ref } from 'vue'
import type { IWidget } from '@/stores/widget'
import { map } from 'lodash'

const spaceStore = useSpaceStore()

let moveable: Moveable | null = null
let selecto: Selecto | null = null
let targets: HTMLElement[] = []


const dropZoneRef = ref<HTMLDivElement>()
function onDrop(files: File[] | null) {
  console.log(files)
}
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

onMounted(() => {
  if (spaceStore.isEditMode) {
    startEditMode({ storeBackup: false })
  }
})

function startEditMode({ storeBackup = true } = {}) {
  spaceStore.setEditMode(true)

  if (storeBackup) {
    spaceStore.widgets.createBackup()
  }

  const moveableContainer = document.querySelector('.space-layout__canvas') as HTMLElement
  const selectoContainer = document.querySelector('.space-layout__canvas__selecto') as HTMLElement
  targets = Array.from(moveableContainer.querySelectorAll('.space-widget.selected'))

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

    bounds: {
      left: 0,
      top: 0,
      right: Infinity,
      bottom: Infinity
    },

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
  spaceStore.setEditMode(false)
  spaceStore.widgets.deleteBackup()

  if (moveable) {
    moveable.destroy()
    moveable = null
  }

  if (selecto) {
    selecto.destroy()
    selecto = null
  }

  const controlBoxes = document.querySelectorAll('.space-layout__canvas > .moveable-control-box');
  for (const controlBox of controlBoxes) {
    controlBox.remove()
  }

  setTargets([])
}

function cancelEditMode() {
  spaceStore.widgets.resetFromBackup()
  stopEditMode()
}

function setStyles(e: OnDrag | OnResize) {
  const widgetId = e.target.dataset.widgetId
  if (!widgetId) {
    return
  }

  if ("translate" in e && Array.isArray(e.translate)) {
    spaceStore.widgets.updateWidget(widgetId, {
      styles: {
        x: e.translate[0],
        y: e.translate[1]
      }
    })
  }

  if (typeof e.width === 'number') {
    e.target.style.width = `${e.width}px`
    spaceStore.widgets.updateWidget(widgetId, {
      styles: {
        width: e.width
      }
    })
  }

  if (typeof e.height === 'number') {
    e.target.style.height = `${e.height}px`
    spaceStore.widgets.updateWidget(widgetId, {
      styles: {
        height: e.height
      }
    })
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
    const widgetId = target.dataset.widgetId
    if (!widgetId) {
      continue
    }
    spaceStore.widgets.updateWidget(widgetId, {
      isSelected: false,
      isSelectedGroup: false
    })
  }

  const isGroup = targets.length > 1
  for (const target of targets) {
    const widgetId = target.dataset.widgetId
    if (!widgetId) {
      continue
    }

    spaceStore.widgets.updateWidget(widgetId, {
      isSelected: true,
      isSelectedGroup: isGroup
    })
  }
}

function refreshTargets() {
  const moveableContainer = document.querySelector('.space-layout__canvas') as HTMLElement
  const selectedWidgets: HTMLElement[] = Array.from(moveableContainer.querySelectorAll('.space-widget.selected'));
  setTargets(selectedWidgets);
}

function startAddModule() {
  setTargets([])
}

async function createdModule(widget: IWidget) {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const widgetWidth = widget.styles.width
  const widgetHeight = widget.styles.height
  const x = (windowWidth - widgetWidth) / 2
  const y = (windowHeight - widgetHeight) / 2
  const zIndex = Math.max(...map(spaceStore.widgets.collection, (w) => w.styles.zIndex)) + 1
  spaceStore.widgets.updateWidget(widget.id, {
    isSelected: true,
    isSelectedGroup: false,
    styles: {
      ...widget.styles,
      x,
      y,
      zIndex
    }
  })
  await nextTick()
  refreshTargets()
}

function handlePaste(e: ClipboardEvent) {
  console.log(e)
  const clipboardData = e.clipboardData
  if (!clipboardData) {
    return
  }

  console.log(clipboardData.getData('text/plain'))

  const image = clipboardData.files[0]
  if (!image) {
    return
  }

  console.log(image)
}
</script>

<template>
  <div
    ref="dropZoneRef"
    class="space-layout"
    @paste="handlePaste"
  >
    <SpaceMenu
      @editModeStart="startEditMode"
      @editModeDone="stopEditMode"
      @editModeCancel="cancelEditMode"
      @deletedWidgets="refreshTargets"
      @addModuleStart="startAddModule"
      @addModuleSubmit="createdModule"
    />
    <div class="space-layout__canvas"
      :class="{
        'cursor-add': isOverDropZone,
      }"
    >
      <div class="space-layout__canvas__selecto"></div>
      <div class="elements selecto-area scroll-area">
        <SpaceWidget
          v-for="widgetId in spaceStore.widgets.widgetKeys"
          :key="widgetId"
          :data-widget-id="widgetId"
          :widget-id="widgetId"
          class="space-widget"
          :class="{
            'selected': spaceStore.widgets.collection[widgetId].isSelected,
          }"
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
.space-layout__canvas {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
