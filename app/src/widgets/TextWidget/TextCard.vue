<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect, type PropType } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import PlaceholderExtension from '@tiptap/extension-placeholder'
import TypographyExtension from '@tiptap/extension-typography'
import UnderlineExtension from '@tiptap/extension-underline'
import { useWidgetStore } from '@/stores/widget'
import { useSpaceStore } from '@/stores/space'
import { useFontStore } from '@/stores/fonts'
import { useUserStore } from '@/stores/user'
import type { TTextWidget } from './types'
import TextMenuSettings from './TextMenuSettings.vue'

const userStore = useUserStore()
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

const widgetId = ref<string | null>(null)

const isEditMode = computed(() => {
  return spaceStore.isEditMode
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
  editable: isSpaceOwner.value && (isEditMode.value || widget.value?.content?.isInteractive),
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
      class: 'p-4 focus:outline-none',
    },
  },
  content: widget.value?.content?.text || '',
})

watchEffect(() => {
  if (widget.value) {
    widgetId.value = widget.value.uid
  }
})

watchEffect(() => {
  const editable = isSpaceOwner.value && (isEditMode.value || widget.value?.content?.isInteractive)
  editor.value?.setEditable(editable)
})

watch(
  () => editor.value?.getHTML() || '',
  (newValue: string, oldValue: string) => {
    if (typeof oldValue === 'undefined') return

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
      widgetStore.markWidgetAsDirty(widget.value.uid)
      widgetStore.debouncedSaveDirtyWidgets(widget.value.space)
    }
  }
)

onMounted(() => {
  if (!widgetId.value) {
    return
  }

  fontStore.connect(widgetId.value)
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
    class="widget-theme-bg widget-theme-text text-widget cursor-auto flex flex-col prose prose-base max-w-none focus:outline-none"
    :style="{
      fontFamily: widget.content.fontFamily,
      fontSize: widget.content.fontSize + 'px',
      textAlign: widget.content.textAlign,
      fontWeight: parsedFontWeight,
      fontStyle: parsedFontStyle,
      lineHeight: widget.content.lineHeight,
    }"
    :editor="editor"/>
  <teleport to="#space__widget-menu">
    <TextMenuSettings v-if="editor" :widgetId="widgetId" :editor="editor" />
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
.text-widget.prose :where(ul):not(:where([class~="not-prose"] *)),
.text-widget.prose :where(ol):not(:where([class~="not-prose"] *)),
.text-widget.prose :where(p):not(:where([class~="not-prose"] *)) {
  margin-top: 0;
  margin-bottom: 0;
}

.text-widget.prose * {
  font-weight: inherit;
  font-family: inherit;
}

.text-widget.prose :where(strong):not(:where([class~="not-prose"] *)) {
  font-weight: bolder;
}
</style>
