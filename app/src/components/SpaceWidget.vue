<script setup lang="ts">
import { ref, watch, reactive, onMounted, computed } from 'vue'
import { useSpring } from '@vueuse/motion'
import { useWidgetStore } from '@/stores/widget'
import { useSpaceStore } from '@/stores/space'

const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()
const widgetRef = ref()

const props = defineProps({
  widgetId: {
    type: String,
    required: true
  }
})

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId)
})

const widgetStyles = computed(() => {
  return widget.value.styles || {}
})

const transformValue = reactive({
  translateX: widget.value.styles ? widget.value.styles.x : 0,
  translateY: widget.value.styles ? widget.value.styles.y : 0,
})

const { set } = useSpring(transformValue)

onMounted(() => {
  watch(
    widgetStyles,
    async (styles) => {
      set({ translateX: styles.x, translateY: styles.y })
    },
    { immediate: true, deep: true }
  )

  watch(
    transformValue,
    (tv) => {
      if (!spaceStore.isEditMode) {
        return
      }

      if (widget.value.isSelectedGroup) {
        return
      }

      const controlBoxes: HTMLElement[] = Array.from(
        document.querySelectorAll('.space-layout__canvas > .moveable-control-box')
      )
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

        controlBox.style.transform = `translate3d(${tv.translateX}px, ${tv.translateY}px, 0)`
      }
    }
  )
})
</script>

<template>
  <div
    class="p-4 absolute"
    ref="widgetRef"
    :class="{
      'bg-red-100': widget.isSelected,
      'bg-blue-100': widget.isSelectedGroup,
      'bg-slate-100': !widget.isSelected && !widget.isSelectedGroup
    }"
    :style="{
      zIndex: widgetStyles.zIndex,
      width: `${widgetStyles.width}px`,
      height: `${widgetStyles.height}px`,
      transform: `translate(${transformValue.translateX}px, ${transformValue.translateY}px)`
    }"
  >
    {{ widget.content }}
  </div>
</template>

<style scoped>
</style>
