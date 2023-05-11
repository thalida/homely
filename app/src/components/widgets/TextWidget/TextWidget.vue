<script setup lang="ts">
import { computed } from 'vue'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import { useWidgetStore } from '@/stores/widget'
import { useSpaceStore } from '@/stores/space'

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()

const isEditing = computed(() => {
  return spaceStore.isEditMode
})

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId)
})

const editor = new EditorJS({
  tools: {
    header: Header,
  }
})
</script>

<template>
  <div id="editorjs" class="bg-slate-100"></div>
</template>

<style scoped>
</style>
