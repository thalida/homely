<script setup lang="ts">
import { computed, ref } from 'vue'
import { BoldIcon, ItalicIcon, UnderlineIcon, ListIcon, ListOrderedIcon } from 'lucide-vue-next'
import { useWidgetStore } from '@/stores/widget'
import { useFontStore } from '@/stores/fonts'
import { useEditorsStore } from '@/stores/editors'
import type { TTextWidget } from './types'

const widgetStore = useWidgetStore()
const fontStore = useFontStore()
const editorsStore = useEditorsStore()

fontStore.loadFonts()

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  },
})

const textAlignments = ref(['left', 'center', 'right'])
const fontSizes = ref([10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 32, 36, 48, 64, 72, 96, 144])

const isSelected = computed(() => {
  return widget.value?.state?.selected;
})

const widget = computed((): TTextWidget => {
  return widgetStore.getWidgetById(props.widgetId) as TTextWidget;
})

const editor = computed(() => {
  return editorsStore.editors[props.widgetId]
})

const hasFonts = computed(() => {
  return fontStore.fonts.length > 0
})

function handleFontChange() {
  if (widget.value.content.fontFamily === null || widget.value.content.fontVariant === null) {
    return null
  }

  const selectedFont = fontStore.fontsByFamily[widget.value.content.fontFamily]
  if (!selectedFont) {
    return null
  }

  const hasVariant = fontStore.fontsByFamily[widget.value.content.fontFamily].variants.includes(widget.value.content.fontVariant)
  if (!hasVariant) {
    widget.value.content.fontVariant = 'regular'
  }
}

const menuItems = ref([
  {
    icon: BoldIcon,
    title: "Bold",
    action: () => editor.value.chain().focus().toggleBold().run(),
    isActive: () => editor.value.isActive("bold"),
  },
  {
    icon: ItalicIcon,
    title: "Italic",
    action: () => editor.value.chain().focus().toggleItalic().run(),
    isActive: () => editor.value.isActive("italic"),
  },
  {
    icon: UnderlineIcon,
    title: "Underline",
    action: () => editor.value.chain().focus().toggleUnderline().run(),
    isActive: () => editor.value.isActive("underline"),
  },
  {
    icon: ListIcon,
    title: "Bullet List",
    action: () => editor.value.chain().focus().toggleBulletList().run(),
    isActive: () => editor.value.isActive("bulletList"),
  },
  {
    icon: ListOrderedIcon,
    title: "Ordered List",
    action: () => editor.value.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.value.isActive("orderedList"),
  },
]);
</script>

<template>
  <div v-if="isSelected && hasFonts">
    <select @change="handleFontChange" v-model="widget.content.fontFamily">
      <option v-for="font in fontStore.fonts" :key="font.family" :value="font.family">
        {{ font.family }}
      </option>
    </select>
    <select v-model="widget.content.fontVariant">
      <option
        v-for="variant in fontStore.fontsByFamily[widget.content.fontFamily].variants"
        :key="variant"
        :value="variant">
        {{ variant }}
      </option>
    </select>
    <select v-model="widget.content.fontSize">
      <option v-for="size in fontSizes" :key="size" :value="size">
        {{ size }}
      </option>
    </select>
    <select v-model="widget.content.textAlign">
      <option v-for="alignment in textAlignments" :key="alignment" :value="alignment">
        {{ alignment }}
      </option>
    </select>
    <label>
      <span>Line Height</span>
      <input type="number" v-model="widget.content.lineHeight" step="0.1" max="2" />
    </label>
    <template v-for="(item, index) in menuItems" :key="index">
      <button
        :class="{
          'bg-red-200': item.isActive(),
          'bg-gray-200': !item.isActive(),
        }"
        @click="item.action"
      >
        <component :is="item.icon" />
      </button>
    </template>
    <label>
      <span>Is Interactive?</span>
      <input type="checkbox" v-model="widget.content.isInteractive" />
    </label>
  </div>
</template>

<style scoped>
</style>
