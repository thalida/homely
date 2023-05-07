<script setup lang="ts">
import { useGesture } from '@vueuse/gesture'
import { type PermissiveMotionProperties, useMotionProperties, useSpring } from '@vueuse/motion'
import { onMounted, ref } from 'vue'

const widgetRef = ref()

const { motionProperties } = useMotionProperties(widgetRef, {
  cursor: 'grab',
})
const { set } = useSpring(motionProperties as Partial<PermissiveMotionProperties>)

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
});

const gestureModule = useGesture(
  {
    onDrag: handleDrag,
  },
  {
    domTarget: widgetRef,
    drag: {
      filterTaps: true,
      bounds: {
        left: 0,
        top: 0,
        right: Infinity,
        bottom: Infinity,
      },
    },
  }
)

onMounted(() => {
  if (typeof gestureModule.config.drag !== 'undefined') {
    gestureModule.config.drag.initial = [props.widget.x, props.widget.y];
  }
})

function handleDrag({ movement: [x, y], dragging }) {
  if (!dragging) {
    return;
  }
  set({ x, y })

  if (typeof gestureModule.config.drag === 'undefined') {
    return;
  }
  gestureModule.config.drag.initial = [x, y];
}
</script>

<template>
  <div ref="widgetRef" class="p-4 bg-slate-100 w-1/5 absolute" :style="{
    transform: `translateX(${widget.x}px) translateY(${widget.y}px)`
  }">
    {{ widget.content }}
  </div>
</template>

<style scoped>

</style>
