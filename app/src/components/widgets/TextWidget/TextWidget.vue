<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useSpaceStore } from '@/stores/space'
import Quill from 'quill'

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const editorEl = ref<HTMLElement>()
const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()

const isSelected = computed(() => {
  return widget.value.state.selected;
})

const isEditing = computed(() => {
  return spaceStore.isEditMode
})

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId)
})

onMounted(() => {
  new Quill(editorEl, {
    modules: {
      toolbar: "#toolbar",
    },
    theme: 'snow',
  });
})
</script>

<template>
  <div ref="editor" v-bind="$attrs">
    <p>Hello World!</p>
    <p>Some initial <strong>bold</strong> text</p>
    <p><br></p>
  </div>
  <teleport to="#space__widget-menu">
    <div v-show="isSelected" id="toolbar"  class="absolute top-0 left-0 w-full bg-slate-300 z-50">
      <div class="toolbar" ref="toolbar">
        <span class="ql-formats">
          <select class="ql-font"></select>
          <select class="ql-header"></select>
        </span>
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
          <button class="ql-strike"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-blockquote"></button>
          <button class="ql-code-block"></button>
          <button class="ql-link"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-list" value="ordered"></button>
          <button class="ql-list" value="bullet"></button>
          <select class="ql-align"></select>
        </span>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
</style>
