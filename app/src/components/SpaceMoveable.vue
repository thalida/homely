
<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue';
import Moveable from "moveable";
import Selecto from "selecto";
// import SpaceMoveableWidget from './SpaceMoveableWidget.vue';

const widgets: Ref<any[]> = ref([
  {
    id: 1,
    content: 'widget 1',
    x: 0,
    y: 0,
  },
  {
    id: 2,
    content: 'widget 2',
    x: 100,
    y: 100,
  },
  {
    id: 3,
    content: 'widget 3',
    x: 300,
    y: 200,
  },
  {
    id: 4,
    content: 'widget 4',
    x: 400,
    y: 0,
  },
  {
    id: 5,
    content: 'widget 5',
    x: 750,
    y: 0,
  },
]);

onMounted(() => {
  console.log("mounted");
  const container = document.querySelector(".space-layout") as HTMLElement;
  // let targets = Array.from(document.querySelectorAll(".space-widget"));
  let targets = []
  console.log("targets", targets)

  const moveable = new Moveable(container, {
    target: targets,
    // If the container is null, the position is fixed. (default: parentElement(document.body))
    draggable: true,
    resizable: false,
    scalable: false,
    rotatable: false,
    warpable: false,
    pinchable: false,
    origin: true,
    keepRatio: true,
    edge: false,
    throttleDrag: 0,
    throttleResize: 0,
    throttleScale: 0,
    throttleRotate: 0,
  });

  const selecto = new Selecto({
    container: document.querySelector(`[data-croffle-ref="selecto"]`),
    dragContainer: window,
    selectableTargets: [".selecto-area .space-widget"],
    hitRate: 0,
    selectByClick: true,
    selectFromInside: true,
    toggleContinueSelect: ["shift"],
    ratio: 0
  });

  function setTargets(nextTargets) {
    targets = nextTargets;
    moveable.target = targets;
  }
  moveable.on("clickGroup", e => {
    selecto!.clickTarget(e.inputEvent, e.inputTarget);
  });
  moveable.on("drag", e => {
    e.target.style.transform = e.transform;
  });
  moveable.on("dragGroup", e => {
    e.events.forEach(ev => {
      ev.target.style.transform = ev.transform;
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
    <div class="elements selecto-area">
      <div
        v-for="widget in widgets"
        class="space-widget p-4 bg-slate-100 w-1/5 absolute"
        :key="widget.id"
        :style="{
          transform: `translateX(${widget.x}px) translateY(${widget.y}px)`
        }">
        {{ widget.content }}
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
.space-widget.selected {
  background-color: #ff0000;
}
</style>
