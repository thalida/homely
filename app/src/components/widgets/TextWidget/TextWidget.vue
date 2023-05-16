<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import PlaceholderExtension from '@tiptap/extension-placeholder'
import TypographyExtension from '@tiptap/extension-typography'
import UnderlineExtension from '@tiptap/extension-underline'
import { BoldIcon, ItalicIcon, UnderlineIcon, ListIcon, ListOrderedIcon } from 'lucide-vue-next'
import { useWidgetStore } from '@/stores/widget'
import { useSpaceStore } from '@/stores/space'
import { useFontStore } from '@/stores/fonts'
import type { ITextWidget } from '@/types/widget'

const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()
const fontStore = useFontStore()

fontStore.loadFonts()

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

const widget = computed((): ITextWidget => {
  return widgetStore.getWidgetById(props.widgetId) as ITextWidget;
})

const hasFonts = computed(() => {
  return fontStore.fonts.length > 0
})
const widgetId = ref<string | null>(null)

watchEffect(() => {
  if (widget.value) {
    widgetId.value = widget.value.id
  }
})

const textAlignments = ref(['left', 'center', 'right'])
const fontSizes = ref([10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24,  32, 36, 48, 64, 72, 96, 144])

const selectedFontSpecs = computed(() => {
  if (widget.value.content.styles.fontFamily === null || widget.value.content.styles.fontVariant === null) {
    return null
  }

  const font = fontStore.fontsByFamily[widget.value.content.styles.fontFamily]
  if (!font) {
    return null
  }

  return font
})
const selectedVariant = computed(() => {
  if (selectedFontSpecs.value === null) {
    return null
  }

  const selectedVariant = selectedFontSpecs.value.variants.filter((v) => v === widget.value.content?.styles.fontVariant)[0]
  if (!selectedVariant) {
    return null
  }

  return selectedVariant
})
const parsedFontWeight = computed(() => {
  if (selectedVariant.value === null) {
    return null
  }

  return selectedVariant.value.replace('italic', '')
})
const parsedFontStyle = computed(() => {
  if (selectedVariant.value === null) {
    return null
  }

  return selectedVariant.value.includes('italic') ? 'italic' : 'normal'
})

function handleFontChange() {
  if (widget.value.content.styles.fontFamily === null || widget.value.content.styles.fontVariant === null) {
    return null
  }

  const selectedFont = fontStore.fontsByFamily[widget.value.content.styles.fontFamily]
  if (!selectedFont) {
    return null
  }

  const hasVariant = fontStore.fontsByFamily[widget.value.content.styles.fontFamily].variants.includes(widget.value.content.styles.fontVariant)
  if (!hasVariant) {
    widget.value.content.styles.fontVariant = 'regular'
  }
}

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      blockquote: false,
      codeBlock: false,
      heading: false,
      horizontalRule: false,
      code: false,
    }),
    LinkExtension,
    PlaceholderExtension,
    TypographyExtension,
    UnderlineExtension,
  ],
  editorProps: {
    attributes: {
      class: 'focus:outline-none',
    },
  },
  content: widget.value?.content?.text || '',
  onUpdate: () => {
    if (typeof widget.value === 'undefined') return
    widgetStore.updateWidget(widget.value.id, {
      content: {
        text: editor.value?.getHTML() || ''
      }
    })
  },
})

const menuItems = ref([
  {
    icon: BoldIcon,
    title: "Bold",
    action: () => editor.value?.chain().focus().toggleBold().run(),
    isActive: () => editor.value?.isActive("bold"),
  },
  {
    icon: ItalicIcon,
    title: "Italic",
    action: () => editor.value?.chain().focus().toggleItalic().run(),
    isActive: () => editor.value?.isActive("italic"),
  },
  {
    icon: UnderlineIcon,
    title: "Underline",
    action: () => editor.value?.chain().focus().toggleUnderline().run(),
    isActive: () => editor.value?.isActive("underline"),
  },
  {
    icon: ListIcon,
    title: "Bullet List",
    action: () => editor.value?.chain().focus().toggleBulletList().run(),
    isActive: () => editor.value?.isActive("bulletList"),
  },
  {
    icon: ListOrderedIcon,
    title: "Ordered List",
    action: () => editor.value?.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.value?.isActive("orderedList"),
  },
]);

watchEffect(() => {
  const editable = isEditing.value || widget.value?.content?.isInteractive
  editor.value?.setEditable(editable)
})

watch(() => widget.value?.content?.text, (value: string) => {
  if (editor.value?.getHTML() === value) return
  editor.value?.commands.setContent(value, false)
})

onMounted(() => {
  fontStore.connect(widget.value.id)
})

onBeforeUnmount(() => {
  if (!widgetId.value) {
    return
  }

  fontStore.disconnect(widgetId.value)
})

</script>

<template>
  <editor-content
    v-bind="$attrs"
    class="text-widget cursor-auto w-full h-full flex flex-col prose prose-base max-w-none focus:outline-none"
    :style="{
      fontFamily: widget.content.styles.fontFamily,
      fontSize: widget.content.styles.fontSize + 'px',
      textAlign: widget.content.styles.textAlign,
      fontWeight: parsedFontWeight,
      fontStyle: parsedFontStyle,
    }"
    :editor="editor"/>
  <teleport to="#space__widget-menu">
    <div v-if="isEditing && isSelected && hasFonts">
      <select @change="handleFontChange" v-model="widget.content.styles.fontFamily">
        <option v-for="font in fontStore.fonts" :key="font.family" :value="font.family">
          {{ font.family }}
        </option>
      </select>
      <select v-model="widget.content.styles.fontVariant">
        <option
          v-for="variant in fontStore.fontsByFamily[widget.content.styles.fontFamily].variants"
          :key="variant"
          :value="variant">
          {{ variant }}
        </option>
      </select>
      <select v-model="widget.content.styles.fontSize">
        <option v-for="size in fontSizes" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
      <select v-model="widget.content.styles.textAlign">
        <option v-for="alignment in textAlignments" :key="alignment" :value="alignment">
          {{ alignment }}
        </option>
      </select>
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
  </teleport>
</template>

<style>
.ProseMirror {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
}
.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
.text-widget.prose :where(p):not(:where([class~="not-prose"] *)) {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

.text-widget.prose * {
  font-weight: inherit;
  font-family: inherit;
}
</style>
