<script setup lang="ts">
import { h, onMounted, render, watchEffect } from 'vue'
import { GridStack, type GridStackNode, type GridItemHTMLElement } from 'gridstack';
import GridStackItem from './GridStackItem.vue'
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';


const props = defineProps({
  editable: {
    type: Boolean,
    default: false
  },
})

const emits = defineEmits<{
  (e: 'dragStart', event: Event, el: GridItemHTMLElement): void,
  (e: 'dragStop', event: Event, el: GridItemHTMLElement): void,
  (e: 'resizeStart', event: Event, el: GridItemHTMLElement): void,
  (e: 'resizeStop', event: Event, el: GridItemHTMLElement): void,
  (e: 'dropped', event: Event, previousWidget: GridStackNode, newWidget: GridStackNode): void,
  (e: 'change', event: Event, items: GridStackNode[]): void,
}>()

let grid: GridStack | null = null;

let wrappers: Record<string, HTMLElement> = {}

onMounted(() => {
  grid = GridStack.init({
    margin: 12,
    cellHeight: 100 + (12 * 2),
    float: true,
    disableOneColumnMode: true,
    acceptWidgets: true,
    minRow: 1,
  })

  GridStack.addRemoveCB = gsAddRemoveVueComponents;

  setGridEditability()

  grid.on('dragstart', function(event: Event, el: GridItemHTMLElement) {
    emits('dragStart', event, el)
  });

  grid.on('dragstop', function(event: Event, el: GridItemHTMLElement) {
    emits('dragStop', event, el)
  });

  grid.on('resizestart', function(event: Event, el: GridItemHTMLElement) {
    emits('resizeStart', event, el)
  });

  grid.on('resizestop', function(event: Event, el: GridItemHTMLElement) {
    emits('resizeStop', event, el)
  });

  grid.on('dropped', function(event: Event, previousWidget: GridStackNode, newWidget: GridStackNode) {
    emits('dropped', event, previousWidget, newWidget)
  });

  grid.on('change', function(event: Event, items: GridStackNode[]) {
    emits('change', event, items)
  });
})

function setGridEditability() {
  if (!grid) {
    return
  }

  if (props.editable) {
    grid?.enable()
  } else {
    grid?.disable()
  }
}

watchEffect(setGridEditability)

function gsAddRemoveVueComponents(host: GridItemHTMLElement | HTMLElement, w: GridStackNode, add: boolean, isGrid: boolean): HTMLElement | undefined {
  if (!host) {
    return
  }

  // Not supported yet
  if (isGrid) {
    return;
  }

  return add ? addWidget(host, w) : removeWidget(host, w);
}

function addWidget(host: GridItemHTMLElement | HTMLElement, w: GridStackNode): HTMLElement | undefined {
  const itemId = w.id
  if (typeof itemId === 'undefined') {
    return
  }

  const itemVNode = h(GridStackItem, { itemId })
  wrappers[itemId] = document.createElement('div')
  wrappers[itemId].id = `shadow-root-widget-${itemId}`
  render(itemVNode, wrappers[itemId])
  return itemVNode.el as HTMLElement
}

function removeWidget(host: GridItemHTMLElement | HTMLElement, w: GridStackNode): HTMLElement | undefined {
  const itemId = w.id
  if (typeof itemId === 'undefined') {
    return
  }

  render(null, wrappers[itemId])
  return;
}


defineExpose({
  getGrid: () => grid,
})

</script>

<template>
  <div class="grid-stack grow shrink-0 w-full h-full"></div>
</template>

<style scoped>

</style>
