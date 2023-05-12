<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect, nextTick } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useSpaceStore } from '@/stores/space'
import { useFontStore } from '@/stores/fonts'
import { has } from 'lodash'
import { text } from 'stream/consumers'

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

const verticalAlignments = ref(['start', 'center', 'end'])
const horiztonalAlignments = ref(['left', 'center', 'right'])
const fontSizes = ref([10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24,  32, 36, 48, 64, 72, 96, 144])
const selectedVAlignment = ref('start')
const selectedHAlignment = ref('left')
const selectedFontSize = ref(16)
const selectedFontFamily = ref('Lato')
const selectedFontVariant = ref('regular')
const selectedFontWeight = computed(() => {
  const selectedFont = fontStore.fontsByFamily[selectedFontFamily.value]
  if (!selectedFont) {
    return null
  }

  const selectedVariant = selectedFont.variants.filter((v) => v === selectedFontVariant.value)[0]
  if (!selectedVariant) {
    return null
  }

  return selectedVariant.replace('italic', '')
})
const selectedFontStyle = computed(() => {
  const selectedFont = fontStore.fontsByFamily[selectedFontFamily.value]
  if (!selectedFont) {
    return null
  }

  const selectedVariant = selectedFont.variants.filter((v) => v === selectedFontVariant.value)[0]
  if (!selectedVariant) {
    return null
  }

  return selectedVariant.includes('italic') ? 'italic' : 'normal'
})
const selectedFontUrl = computed(() => {
  const selectedFont = fontStore.fontsByFamily[selectedFontFamily.value]

  if (!selectedFont) {
    return null
  }

  const selectedVariant = selectedFont.variants.filter((v) => v === selectedFontVariant.value)[0]

  if (!selectedVariant) {
    return null
  }

  return `https://fonts.googleapis.com/css?family=${selectedFont.family.replace(/ /g, '+')}:${selectedVariant}`
})

function handleFontChange() {
  const hasVariant = fontStore.fontsByFamily[selectedFontFamily.value].variants.includes(selectedFontVariant.value)
  if (!hasVariant) {
    selectedFontVariant.value = 'regular'
  }
}

onMounted(async () => {
  await fontStore.loadFonts()
})

</script>

<template>
  <div v-bind="$attrs" :contenteditable="isEditing" class="flex whitespace-pre-wrap cursor-auto w-full h-full" :style="{
    fontFamily: selectedFontFamily,
    fontWeight: selectedFontWeight,
    fontStyle: selectedFontStyle,
    fontSize: selectedFontSize + 'px',
    justifyContent: selectedHAlignment,
    alignItems: selectedVAlignment,
  }">
    Some text here

    and here
  </div>
  <teleport to="body">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link v-if="selectedFontUrl" :href="selectedFontUrl" rel="stylesheet" type="text/css">
  </teleport>
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
      <select v-model="selectedFontSize">
        <option v-for="size in fontSizes" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
      <select v-model="selectedHAlignment">
        <option v-for="alignment in horiztonalAlignments" :key="alignment" :value="alignment">
          {{ alignment }}
        </option>
      </select>
      <select v-model="selectedVAlignment">
        <option v-for="alignment in verticalAlignments" :key="alignment" :value="alignment">
          {{ alignment }}
        </option>
      </select>
    </div>
  </teleport>
</template>

<style scoped>
</style>
