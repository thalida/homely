<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useSpaceStore } from '@/stores/space'
import { useFontStore } from '@/stores/fonts'
import type { ITextWidgetContent } from '@/types/widget'
import { throttle } from 'lodash'

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

const widgetContent = computed(() => {
  return widget.value.content as ITextWidgetContent
})

const hasFonts = computed(() => {
  return fontStore.fonts.length > 0
})

const verticalAlignments = ref(['top', 'center', 'bottom'])
const horiztonalAlignments = ref(['left', 'center', 'right'])
const fontSizes = ref([10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24,  32, 36, 48, 64, 72, 96, 144])

const verticalAlignmentFlexMap = ref({
  top: 'start',
  center: 'center',
  bottom: 'end'
} as { [key: string]: string })
const selectedFontWeight = computed(() => {
  if (widgetContent.value === null) {
    return null
  }

  if (widgetContent.value.styles.fontFamily === null || widgetContent.value.styles.fontVariant === null) {
    return null
  }

  const selectedFont = fontStore.fontsByFamily[widgetContent.value.styles.fontFamily]
  if (!selectedFont) {
    return null
  }

  const selectedVariant = selectedFont.variants.filter((v) => v === widgetContent.value?.styles.fontVariant)[0]
  if (!selectedVariant) {
    return null
  }

  return selectedVariant.replace('italic', '')
})
const selectedFontStyle = computed(() => {
  if (widgetContent.value === null) {
    return null
  }

  if (widgetContent.value.styles.fontFamily === null || widgetContent.value.styles.fontVariant === null) {
    return null
  }

  const selectedFont = fontStore.fontsByFamily[widgetContent.value.styles.fontFamily]
  if (!selectedFont) {
    return null
  }

  const selectedVariant = selectedFont.variants.filter((v) => v === widgetContent.value?.styles.fontVariant)[0]
  if (!selectedVariant) {
    return null
  }

  return selectedVariant.includes('italic') ? 'italic' : 'normal'
})
const selectedFontUrl = computed(() => {
  if (widgetContent.value === null) {
    return null
  }

  if (widgetContent.value.styles.fontFamily === null || widgetContent.value.styles.fontVariant === null) {
    return null
  }

  const selectedFont = fontStore.fontsByFamily[widgetContent.value.styles.fontFamily]
  if (!selectedFont) {
    return null
  }


  const selectedVariant = selectedFont.variants.filter((v) => v === widgetContent.value?.styles.fontVariant)[0]
  if (!selectedVariant) {
    return null
  }

  return `https://fonts.googleapis.com/css?family=${selectedFont.family.replace(/ /g, '+')}:${selectedVariant}`
})

function handleFontChange() {
  if (widgetContent.value === null) {
    return null
  }

  if (widgetContent.value.styles.fontFamily === null || widgetContent.value.styles.fontVariant === null) {
    return null
  }

  const selectedFont = fontStore.fontsByFamily[widgetContent.value.styles.fontFamily]
  if (!selectedFont) {
    return null
  }

  const hasVariant = fontStore.fontsByFamily[widgetContent.value.styles.fontFamily].variants.includes(widgetContent.value.styles.fontVariant)
  if (!hasVariant) {
    widgetContent.value.styles.fontVariant = 'regular'
  }
}

function handleEditorInput(e: Event) {
  widgetStore.updateWidget(widget.value.id, {
    content: {
      text: (e.target as HTMLDivElement).innerText
    }
  })
}

onMounted(async () => {
  await fontStore.loadFonts()
})

</script>

<template>
  <div
    v-bind="$attrs"
    class="flex whitespace-pre-wrap cursor-auto w-full h-full"
    :style="{
      fontFamily:  widgetContent?.styles.fontFamily,
      fontWeight: selectedFontWeight,
      fontStyle: selectedFontStyle,
      fontSize:  widgetContent?.styles.fontSize + 'px',
      justifyContent:  widgetContent?.styles.horizontalAlignment,
      alignItems: verticalAlignmentFlexMap[widgetContent?.styles.verticalAlignment],
    }">
    <p
      class="w-full h-full"
      v-once
      role="textbox"
      aria-multiline="true"
      :contenteditable="isEditing"
      @input="handleEditorInput"
    >
      {{ widgetContent?.text }}
    </p>
  </div>
  <teleport to="body">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link v-if="selectedFontUrl" :href="selectedFontUrl" rel="stylesheet" type="text/css">
  </teleport>
  <teleport to="#space__widget-menu">
    <div v-if="isEditing && isSelected && hasFonts">
      <select @change="handleFontChange" v-model="widgetContent.styles.fontFamily">
        <option v-for="font in fontStore.fonts" :key="font.family" :value="font.family">
          {{ font.family }}
        </option>
      </select>
      <select v-model="widgetContent.styles.fontVariant">
        <option
          v-for="variant in fontStore.fontsByFamily[widgetContent.styles.fontFamily].variants"
          :key="variant"
          :value="variant">
          {{ variant }}
        </option>
      </select>
      <select v-model="widgetContent.styles.fontSize">
        <option v-for="size in fontSizes" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
      <select v-model="widgetContent.styles.horizontalAlignment">
        <option v-for="alignment in horiztonalAlignments" :key="alignment" :value="alignment">
          {{ alignment }}
        </option>
      </select>
      <select v-model="widgetContent.styles.verticalAlignment">
        <option v-for="alignment in verticalAlignments" :key="alignment" :value="alignment">
          {{ alignment }}
        </option>
      </select>
    </div>
  </teleport>
</template>

<style scoped>
</style>
