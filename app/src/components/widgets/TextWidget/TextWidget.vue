<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useSpaceStore } from '@/stores/space'
import { useFontStore } from '@/stores/fonts'
import type { ITextWidgetContent } from '@/types/widget'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import PlaceholderExtension from '@tiptap/extension-placeholder'
import TypographyExtension from '@tiptap/extension-typography'
import TaskListExtension from '@tiptap/extension-task-list'
import TaskItemExtension from '@tiptap/extension-task-item'
import UnderlineExtension from '@tiptap/extension-underline'
import { BoldIcon } from 'lucide-vue-next'
import { ItalicIcon } from 'lucide-vue-next'
import { UnderlineIcon } from 'lucide-vue-next'
import { ListIcon } from 'lucide-vue-next'
import { ListOrderedIcon } from 'lucide-vue-next'
import { ListChecksIcon } from 'lucide-vue-next'

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

const textAlignments = ref(['left', 'center', 'right'])
const fontSizes = ref([10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24,  32, 36, 48, 64, 72, 96, 144])

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

const editor = useEditor({
  extensions: [
    LinkExtension,
    PlaceholderExtension,
    TypographyExtension,
    UnderlineExtension,
    TaskListExtension,
    TaskItemExtension.configure({
      nested: true,
    }),
    StarterKit.configure({
      blockquote: false,
      codeBlock: false,
      heading: false,
      horizontalRule: false,
      code: false,
    })
  ],
  editorProps: {
    attributes: {
      class: 'focus:outline-none',
    },
  },
  content: widget.value?.content?.text || '',
  onUpdate: () => {
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
  {
    icon: ListChecksIcon,
    title: "Task List",
    action: () => editor.value?.chain().focus()?.toggleTaskList().run(),
    isActive: () => editor.value?.isActive("taskList"),
  },
]);

onMounted(async () => {
  await fontStore.loadFonts()
})

</script>

<template>
  <editor-content
    v-bind="$attrs"
    class="text-widget cursor-auto w-full h-full flex flex-col prose prose-base m-5 max-w-none focus:outline-none"
    :style="{
      fontFamily: widgetContent?.styles.fontFamily,
      fontWeight: selectedFontWeight,
      fontStyle: selectedFontStyle,
      fontSize: widgetContent?.styles.fontSize + 'px',
      textAlign: widgetContent?.styles.textAlign,
    }"
    :editor="editor"/>
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
      <select v-model="widgetContent.styles.textAlign">
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
</style>
