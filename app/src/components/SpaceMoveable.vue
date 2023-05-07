
<script setup lang="ts">
import { type Ref, ref, onMounted, reactive } from 'vue';
import Moveable from "moveable";
import Selecto from "selecto";
import SpaceMoveableWidget from './SpaceMoveableWidget.vue';

const widgets = reactive({
  1: {
    id: 1,
    content: 'widget 1',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
  2: {
    id: 2,
    content: 'widget 2',
    x: 100,
    y: 100,
    width: 200,
    height: 200,
  },
  3: {
    id: 3,
    content: 'widget 3',
    x: 300,
    y: 200,
    width: 200,
    height: 400,
  },
  4: {
    id: 4,
    content: 'widget 4',
    x: 400,
    y: 0,
    width: 200,
    height: 200,
  },
  5: {
    id: 5,
    content: 'widget 5',
    x: 750,
    y: 0,
    width: 300,
    height: 300,
  },
});
const widgetOrder: Ref<number[]> = ref([1, 2, 3, 4, 5]);

onMounted(() => {
  const container = document.querySelector(".space-layout") as HTMLElement;
  let targets = []

  const moveable = new Moveable(container, {
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
    snapThreshold: 5,
    maxSnapElementGuidelineDistance: undefined,
    elementGuidelines: targets,
    snapDirections: { "top": true, "left": true, "bottom": true, "right": true, "center": true, "middle": true },
    elementSnapDirections: { "top": true, "left": true, "bottom": true, "right": true, "center": true, "middle": true },
  });

  const selecto = new Selecto({
    container: document.querySelector(`[data-croffle-ref="selecto"]`),
    dragContainer: window,
    selectableTargets: [".selecto-area .space-widget"],
    hitRate: 0,
    selectByClick: true,
    selectFromInside: false,
    toggleContinueSelect: ["shift"],
    ratio: 0
  });

  async function setStyles(e) {
    const widgetId = e.target.dataset.widgetId;
    if (!widgetId) {
      return;
    }

    if (Array.isArray(e.translate)) {
      widgets[widgetId].x = e.translate[0];
      widgets[widgetId].y = e.translate[1];
    }

    e.target.style.width = `${e.width}px`;
    e.target.style.height = `${e.height}px`;

    if (typeof e.width === "number") {
      widgets[widgetId].width = e.width;
    }

    if (typeof e.height === "number") {
      widgets[widgetId].height = e.height;
    }
  }

  function setTargets(nextTargets) {
    targets = nextTargets;
    moveable.target = targets;
    moveable.elementGuidelines = Array.from(document.querySelectorAll(".selecto-area .space-widget")).filter(t => !t.classList.contains("selected"));
  }
  moveable.on("clickGroup", e => {
    selecto!.clickTarget(e.inputEvent, e.inputTarget);
  });
  moveable.on("drag", e => {
    setStyles(e)
  });
  moveable.on("dragGroup", e => {
    e.events.forEach(ev => {
      setStyles(ev);
    });
  });
  moveable.on("resize", e => {
    setStyles(e);
  });
  moveable.on("resizeGroup", e => {
    e.events.forEach(ev => {
      setStyles(ev);
    });
  });

  selecto.on("dragStart", e => {
    const target = e.inputEvent.target;
    const isMoveable = moveable.isMoveableElement(target);
    if (isMoveable) {
      e.stop();
    }

    if (targets.some(t => t === target || t.contains(target))) {
      e.stop();
    }
  });
  selecto.on("select", e => {
    e.added.forEach(el => {
      el.classList.add("selected");
    });
    e.removed.forEach(el => {
      el.classList.remove("selected");
    });
  });
  selecto.on("selectEnd", e => {
    if (e.isDragStart) {
      e.inputEvent.preventDefault();
      moveable.waitToChangeTarget().then(() => {
        moveable.dragStart(e.inputEvent);
      });
    }
    setTargets(e.selected);
  });
});

</script>

<template>
  <div class="space-layout">
    <div data-croffle-ref="selecto"></div>
    <div class="elements selecto-area scroll-area">
      <SpaceMoveableWidget
        v-for="widgetId in widgetOrder"
        :data-widget-id="widgetId"
        class="space-widget"
        :key="widgetId"
        :widget="widgets[widgetId]">
      </SpaceMoveableWidget>
    </div>
  </div>
</template>

<style scoped>
.space-layout {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
}
.space-widget.selected {
  background-color: #ff0000;
}
</style>
