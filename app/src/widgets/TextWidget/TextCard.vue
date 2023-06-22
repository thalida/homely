<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect, type PropType } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import PlaceholderExtension from '@tiptap/extension-placeholder'
import TypographyExtension from '@tiptap/extension-typography'
import UnderlineExtension from '@tiptap/extension-underline'
import { EditorState } from '@tiptap/pm/state'
import { ChangeSet } from "@tiptap/pm/changeset"
import { useWidgetStore } from '@/stores/widget'
import { useSpaceStore } from '@/stores/space'
import { useFontStore } from '@/stores/fonts'
import { useUserStore } from '@/stores/user'
import { useEditorsStore } from '@/stores/editors'
import type { TTextWidget } from './types'


const userStore = useUserStore()
const spaceStore = useSpaceStore()
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
  isPlaceholder: {
    type: Boolean,
    required: false,
    default: false
  },
  placeholderWidget: {
    type: Object as PropType<TTextWidget>,
    required: false,
    default: null
  },
})

const isEditMode = computed(() => {
  return widgetStore.isEditing[widget.value?.space]
})

const widget = computed((): TTextWidget => {
  return props.isPlaceholder ? props.placeholderWidget : widgetStore.getWidgetById(props.widgetId) as TTextWidget;
})

const space = computed(() => {
  return widget.value ? spaceStore.collection[widget.value.space] : null
})

const isSpaceOwner = computed(() => {
  return space.value?.owner === userStore.user?.pk
})

const isEditable = computed(() => {
  if (!widget.value) {
    return false
  }

  if (!widget.value.content) {
    return false
  }

  if (props.isPlaceholder) {
    return false
  }

  return isSpaceOwner.value && (isEditMode.value || widget.value.content.isInteractive)
})

const selectedFontSpecs = computed(() => {
  if (widget.value.content.fontFamily === null || widget.value.content.fontVariant === null) {
    return null
  }

  const font = fontStore.fontsByFamily[widget.value.content.fontFamily]
  if (!font) {
    return null
  }

  return font
})

const selectedVariant = computed(() => {
  if (selectedFontSpecs.value === null) {
    return null
  }

  const selectedVariant = selectedFontSpecs.value.variants.filter((v) => v === widget.value.content?.fontVariant)[0]
  if (!selectedVariant) {
    return null
  }

  return selectedVariant
})

const parsedFontWeight = computed(() => {
  if (selectedVariant.value === null) {
    return null
  }

  const fontWeight = selectedVariant.value.replace('italic', '')

  return fontWeight === 'regular' ? 400 : fontWeight
})

const parsedFontStyle = computed(() => {
  if (selectedVariant.value === null) {
    return null
  }

  return selectedVariant.value.includes('italic') ? 'italic' : 'normal'
})

const editor = useEditor({
  editable: isEditable.value,
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
})

watchEffect(() => {
  if (props.isPlaceholder) {
    return
  }

  editor.value?.setEditable(isEditable.value)
})

watchEffect(() => {
  const isSame = widget.value?.content?.text === editor.value?.getHTML()
  if (isSame || props.isPlaceholder) {
    return
  }

  editor.value?.commands.setContent(widget.value?.content?.text || '')
})

watch(
  () => editor.value?.getHTML() || '',
  (newValue: string, oldValue: string) => {
    if (typeof oldValue === 'undefined') return

    const canUndo = editor.value?.can().undo()
    const canRedo = editor.value?.can().redo()
    const hasChanges = canUndo || canRedo
    if (!hasChanges) {
      return
    }

    if (!editor.value?.isEditable) {
      widgetStore.updateWidget(widget.value.uid, {
        content: {
          text: editor.value?.getHTML() || ''
        }
      });
      return
    }

    widgetStore.draftUpdateWidget(widget.value.uid, {
      content: {
        text: editor.value?.getHTML() || ''
      }
    })

    if (editor.value?.isEditable && !isEditMode.value && newValue !== oldValue) {
      widgetStore.debouncedSaveDirtyWidgets(widget.value.space)
    }
  }
)

onMounted(() => {
  if (!props.widgetId) {
    return
  }

  fontStore.connect(props.widgetId)

  if (typeof editor.value !== 'undefined') {
    editorsStore.connect(props.widgetId, editor.value)
  }
})

onBeforeUnmount(() => {
  if (!props.widgetId) {
    return
  }

  fontStore.disconnect(props.widgetId)
})

defineExpose({
  canSelect: isEditable
})
</script>

<template>
  <div class="widget-theme-bg widget-theme-text text-widget p-4">
    <editor-content
      class="cursor-auto flex flex-col prose prose-base max-w-none widget-theme-text focus:outline-none"
      :style="{
        fontFamily: widget.content.fontFamily,
        fontSize: widget.content.fontSize + 'px',
        textAlign: widget.content.textAlign,
        fontWeight: parsedFontWeight,
        fontStyle: parsedFontStyle,
        lineHeight: widget.content.lineHeight,
      }"
      :editor="editor"/>
  </div>
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
.text-widget > .prose :where(ul):not(:where([class~="not-prose"] *)),
.text-widget > .prose :where(ol):not(:where([class~="not-prose"] *)),
.text-widget > .prose :where(p):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
  margin-bottom: 0;
}

.text-widget > .prose * {
  font-weight: inherit;
  font-family: inherit;
  color: inherit;
}

.text-widget > .prose :where(strong):not(:where([class~="not-prose"] *)) {
  font-weight: bolder;
}
</style>
