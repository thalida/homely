<script setup lang="ts">
import { h, onMounted, render, watchEffect, type PropType, ref } from 'vue'
import { GridStack, type GridStackNode, type GridItemHTMLElement, type GridStackOptions } from 'gridstack';
import GridStackItem from './GridStackItem.vue'
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';


const props = defineProps({
  options: {
    type: Object as PropType<GridStackOptions>,
    default: () => ({})
  },
  editable: {
    type: Boolean,
    default: false
  },
})

const emits = defineEmits<{
  (e: 'added', event: Event, items: GridStackNode[]): void,
  (e: 'change', event: Event, items: GridStackNode[]): void,
  (e: 'disable', event: Event): void,
  (e: 'dragstart', event: Event, el: GridItemHTMLElement): void,
  (e: 'drag', event: Event, el: GridItemHTMLElement): void,
  (e: 'dragstop', event: Event, el: GridItemHTMLElement): void,
  (e: 'dropped', event: Event, previousWidget: GridStackNode, newWidget: GridStackNode): void,
  (e: 'enable', event: Event): void,
  (e: 'resizestart', event: Event, el: GridItemHTMLElement): void,
  (e: 'resize', event: Event, el: GridItemHTMLElement): void,
  (e: 'resizestop', event: Event, el: GridItemHTMLElement): void,
}>()


const gridEl = ref<HTMLElement>();
let grid: GridStack | null = null;

let wrappers: Record<string, HTMLElement> = {}

onMounted(() => {
  grid = GridStack.init(props.options, gridEl.value);

  GridStack.addRemoveCB = gsAddRemoveVueComponents;

  grid.on('added', function(event: Event, items: GridStackNode[]) {
    emits('added', event, items)
  });

  grid.on('change', function(event: Event, items: GridStackNode[]) {
    emits('change', event, items)
  });

  grid.on('disable', function(event: Event) {
    emits('disable', event)
  });

  grid.on('dragstart', function(event: Event, el: GridItemHTMLElement) {
    emits('dragstart', event, el)
  });

  grid.on('drag', function(event: Event, el: GridItemHTMLElement) {
    emits('drag', event, el)
  });

  grid.on('dragstop', function(event: Event, el: GridItemHTMLElement) {
    emits('dragstop', event, el)
  });

  grid.on('dropped', function(event: Event, previousWidget: GridStackNode, newWidget: GridStackNode) {
    emits('dropped', event, previousWidget, newWidget)
  });

  grid.on('enable', function(event: Event) {
    emits('enable', event)
  });

  grid.on('resizestart', function(event: Event, el: GridItemHTMLElement) {
    emits('resizestart', event, el)
  });

  grid.on('resize', function(event: Event, el: GridItemHTMLElement) {
    emits('resize', event, el)
  });

  grid.on('resizestop', function(event: Event, el: GridItemHTMLElement) {
    emits('resizestop', event, el)
  });

  watchEffect(() => {
    if (!grid) {
      return
    }

    if (props.editable) {
      grid?.enable()
    } else {
      grid?.disable()
    }
  })
})


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
  <div ref="gridEl" class="grid-stack grow shrink-0 w-full h-full"></div>
</template>

<style scoped>

</style>
