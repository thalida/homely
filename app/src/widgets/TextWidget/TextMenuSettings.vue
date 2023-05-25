<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { BoldIcon, ItalicIcon, UnderlineIcon, ListIcon, ListOrderedIcon } from 'lucide-vue-next'
import { useWidgetStore } from '@/stores/widget'
import { useSpaceStore } from '@/stores/space'
import { useFontStore } from '@/stores/fonts'
import type { TTextWidget } from './types'

const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()
const fontStore = useFontStore()

fontStore.loadFonts()

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  },
  editor: {
    type: Object,
    required: true
  },
})

const widgetId = ref<string | null>(null)
const textAlignments = ref(['left', 'center', 'right'])
const fontSizes = ref([10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 32, 36, 48, 64, 72, 96, 144])

const isSelected = computed(() => {
  return widget.value?.state?.selected;
})

const isEditMode = computed(() => {
  return spaceStore.isEditMode
})

const widget = computed((): TTextWidget => {
  return widgetStore.getWidgetById(props.widgetId) as TTextWidget;
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
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive("bold"),
  },
  {
    icon: ItalicIcon,
    title: "Italic",
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive("italic"),
  },
  {
    icon: UnderlineIcon,
    title: "Underline",
    action: () => props.editor.chain().focus().toggleUnderline().run(),
    isActive: () => props.editor.isActive("underline"),
  },
  {
    icon: ListIcon,
    title: "Bullet List",
    action: () => props.editor.chain().focus().toggleBulletList().run(),
    isActive: () => props.editor.isActive("bulletList"),
  },
  {
    icon: ListOrderedIcon,
    title: "Ordered List",
    action: () => props.editor.chain().focus().toggleOrderedList().run(),
    isActive: () => props.editor.isActive("orderedList"),
  },
]);

watchEffect(() => {
  if (widget.value) {
    widgetId.value = widget.value.uid
  }
})

watchEffect(() => {
  const editable = isEditMode.value || widget.value?.content?.isInteractive
  props.editor.setEditable(editable)
})

watch(
  () => props.editor.getHTML() || '',
  (newValue: string, oldValue: string) => {
    if (typeof oldValue === 'undefined') return

    if (!props.editor.isEditable) {
      widgetStore.updateWidget(widget.value.uid, {
        content: {
          text: props.editor.getHTML() || ''
        }
      });
      return
    }

    widgetStore.draftUpdateWidget(widget.value.uid, {
      content: {
        text: props.editor.getHTML() || ''
      }
    })

    if (props.editor.isEditable && !isEditMode.value && newValue !== oldValue) {
      widgetStore.markWidgetAsDirty(widget.value.uid)
      widgetStore.debouncedSaveDirtyWidgets(widget.value.space)
    }
  }
)

onMounted(() => {
  fontStore.connect(widget.value.uid)
})

onBeforeUnmount(() => {
  if (!widgetId.value) {
    return
  }

  fontStore.disconnect(widgetId.value)
})

</script>

<template>
  <div v-if="isEditMode && isSelected && hasFonts">
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
