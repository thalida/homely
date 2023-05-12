<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect, nextTick } from 'vue'
import Quill from 'quill'
import { useWidgetStore } from '@/stores/widget'
import { useSpaceStore } from '@/stores/space'
import { useFontStore } from '@/stores/fonts'

const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()
const fontStore = useFontStore()

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})
const editorId = computed(() => {
  return `editor-${props.widgetId}`
})
const toolbarId = computed(() => {
  return `toolbar-${props.widgetId}`
})

const isTemporary = computed(() => {
  return widget.value?.state?.temporary;
})
const isSelected = computed(() => {
  return widget.value?.state?.selected;
})

const isEditing = computed(() => {
  return spaceStore.isEditMode
})

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId)
})

const hasFonts = computed(() => {
  return fontStore.fonts.length > 0
})

let quillEditor: Quill | null = null

onMounted(async () => {
  await fontStore.loadFonts()
  await nextTick()
  console.log(fontStore.fontsByFamily)
  initQuill()
})

function initQuill() {
  if (quillEditor !== null) {
    return
  }

  quillEditor = new Quill(`#${editorId.value}`, {
    modules: {
      toolbar: false,
    },
    theme: 'snow',
  });

  quillEditor.enable(spaceStore.isEditMode)

  watchEffect(() => {
    if (quillEditor === null) {
      return
    }

    quillEditor.enable(isEditing.value)
  })

  watchEffect(async () => {
    if (isTemporary.value || quillEditor !== null) {
      return
    }

    initQuill()
  }, { flush: 'post' })

  watch(() => spaceStore.isEditMode, () => {
    if (quillEditor === null) {
      return
    }
    quillEditor.enable(spaceStore.isEditMode)
  })
}

const selectedFontFamily = ref('Lato')
const selectedFontVariant = ref('regular')

function handleFontChange(e: Event) {
  const target = e.target as HTMLSelectElement
  const font = target.value
  quillEditor?.format('font', font)
}

function handleFontVariantChange(e: Event) {
  const target = e.target as HTMLSelectElement
  const variant = target.value
  quillEditor?.format('variant', variant)
}

</script>

<template>
  <div :id="editorId" v-bind="$attrs">
    <p>Hello World!</p>
    <p>Some initial <strong>bold</strong> text</p>
  </div>
  <teleport to="#space__widget-menu">
    <div v-if="isEditing && isSelected && hasFonts">
      <select @change="handleFontChange" v-model="selectedFontFamily">
        <option v-for="font in fontStore.fonts" :key="font.family" :value="font.family">
          {{ font.family }}
        </option>
      </select>
      <select @change="handleFontVariantChange" v-model="selectedFontVariant">
        <option
          v-for="variant in fontStore.fontsByFamily[selectedFontFamily].variants"
          :key="variant"
          :value="variant">
          {{ variant }}
        </option>
      </select>
    </div>
  </teleport>
</template>

<style>
.ql-picker-options {
  overflow: auto;
  height: 200px;
}
</style>
