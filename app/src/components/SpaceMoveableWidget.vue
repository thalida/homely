<script setup lang="ts">
import {ref, watch, reactive, watchEffect, onMounted, nextTick } from 'vue'
import { useSpring } from '@vueuse/motion'

const widgetRef = ref()

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
});

const transformValue = reactive({
  translateX: props.widget.x,
  translateY: props.widget.y,
});

const { set } = useSpring(transformValue)

onMounted(() => {
  watch(props.widget, async (w) => {
    set({ translateX: w.x, translateY: w.y });
  }, { immediate: true })

  watch(transformValue, (tv) => {
    const controlBoxes = Array.from(document.querySelectorAll('.space-layout > .moveable-control-box'))
    if (controlBoxes.length === 0) {
      return
    }
    for (const controlBox of controlBoxes) {
      const rect = controlBox.getBoundingClientRect()
      const hasSize = rect.width !== 0 && rect.height !== 0
      const hasChildNodes = controlBox.hasChildNodes()

      if (!hasSize || !hasChildNodes) {
        continue
      }
      controlBox.style.transform = `translate3d(${tv.translateX}px, ${tv.translateY}px, 0)`;
    }
  }, { immediate: true, flush: 'post' });
});

</script>

<template>
  <div
    class="p-4 bg-slate-100 absolute"
    ref="widgetRef"
    :style="{
      width: `${widget.width}px`,
      height: `${widget.height}px`,
      transform: `translate(${transformValue.translateX}px, ${transformValue.translateY}px)`
    }">
      {{ widget.content }}
  </div>
</template>

<style scoped>

</style>
