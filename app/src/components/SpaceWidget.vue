<script setup lang="ts">
import { useGesture } from '@vueuse/gesture'
import { type PermissiveMotionProperties, useMotionProperties, useSpring } from '@vueuse/motion'
import { ref } from 'vue'

const widgetRef = ref()

const { motionProperties } = useMotionProperties(widgetRef, {
  cursor: 'grab',
})
const { set } = useSpring(motionProperties as Partial<PermissiveMotionProperties>)

defineProps({
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
  }
)

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
  <div ref="widgetRef">
    {{ widget.content }}
  </div>
</template>

<style scoped>

</style>
