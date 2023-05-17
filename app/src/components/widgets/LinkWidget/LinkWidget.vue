<script setup lang="ts">
import axios from 'axios'
import { computed, ref, watchEffect } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useWidgetStore } from '@/stores/widget'
import { ELinkWidgetStyle, type ILinkWidget } from '@/types/widget'
import { useSpaceStore } from '@/stores/space'
import iconTags from 'lucide-static/tags.json'

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()

const linkEl = ref(null)

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId) as ILinkWidget;
})

const isEditing = computed(() => {
  return spaceStore.isEditMode
})

const isSelected = computed(() => {
  return widget.value.state.selected;
})

const styleOptions = computed(() => {
  return Object.values(ELinkWidgetStyle)
})

const supportedIcons = computed(() => {
  return Object.keys(iconTags)
})

const selectedIconUrl = computed(() => {
  const metadataIcon = widget.value.content.metadata?.icon
  const fallbackIcon = 'link'
  const customIcon = widget.value.content.icon || fallbackIcon

  if (widget.value.content.useCustomIcon) {
    return `https://unpkg.com/lucide-static@latest/icons/${customIcon}.svg`
  }

  if (metadataIcon) {
    return metadataIcon
  }

  return `https://unpkg.com/lucide-static@latest/icons/${fallbackIcon}.svg`
})

const url = ref('')

watchEffect(() => {
  if (widget.value && widget.value.content !== null) {
    url.value = widget.value.content.url || ''
  }
})

async function getMetadata(url: string) {
  const apiUrl = `http://0.0.0.0:8000/metadata`
  const res = await axios.get(apiUrl, {
    params: { url }
  })

  return res.data
}

async function handleUrlChange() {
  try {
    const metadata = await getMetadata(url.value)
    widgetStore.updateWidget(props.widgetId, {
      content: {
        url: url.value,
        metadata,
      },
    })
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <component
    :is="isEditing ? 'div' : 'a'"
    ref="linkEl"
    v-bind="$attrs"
    class="flex w-full h-full cursor-pointer overflow-auto bg-slate-100"
    :class="{
      'ring-2 ring-pink-500': isSelected,
      'justify-center items-center p-8': widget.content.style === ELinkWidgetStyle.ICON,
      'relative flex flex-row items-center justify-end': widget.content.style === ELinkWidgetStyle.FLAG,
      'relative flex flex-col': widget.content.style === ELinkWidgetStyle.CARD,
    }"
    :href="widget.content.url ? widget.content.url : ''"
    target="_blank"
  >
    <div
      v-if="widget.content.style == ELinkWidgetStyle.ICON"
      class="bg-contain bg-no-repeat bg-center w-full h-full"
      :style="{
        backgroundImage:`url(${selectedIconUrl})`,
      }"
    ></div>
    <template v-else>
      <div
        v-if="widget.content.showImage"
        class="bg-cover bg-no-repeat bg-center shrink-0 from-indigo-500 via-purple-500 to-pink-500"
        :class="{
          'fixed inset-y-0 left-0 w-1/3 rounded-l-xl': widget.content.style === ELinkWidgetStyle.FLAG,
          'inset-x-0 top-0 h-1/2 rounded-t-xl grow': widget.content.style === ELinkWidgetStyle.CARD,
        }"
        :style="{
          backgroundImage: widget.content.metadata?.image ? `url(${widget.content.metadata?.image})` : 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
        }"
        :title="widget.content.metadata['image:alt'] || widget.content.url"
      ></div>
      <div
        v-if="widget.content.showDescription || widget.content.showTitle || widget.content.showUrl"
        class="flex flex-col p-4 my-auto space-y-2"
        :class="{
          'w-2/3': widget.content.style === ELinkWidgetStyle.FLAG && widget.content.showImage,
          'w-full': widget.content.style === ELinkWidgetStyle.CARD || (widget.content.style === ELinkWidgetStyle.FLAG && !widget.content.showImage),
        }"
      >
        <div v-if="widget.content.showTitle" class="flex flex-row space-x-2 items-center">
          <div
            class="bg-cover bg-no-repeat bg-center w-6 h-6 shrink-0"
            :style="{
              backgroundImage: `url(${selectedIconUrl})`,
            }"
          ></div>
          <span class="font-bold text-lg">{{  widget.content.metadata?.title || widget.content.url || "Sample Link" }}</span>
        </div>
        <p v-if="widget.content.showDescription" class="text-sm">{{ widget.content.metadata?.description || "Enter a url on the sidebar menu to create a link" }}</p>
        <p v-if="widget.content.showUrl" class="text-xs">{{ widget.content.url || "https://link.example.com" }}</p>
      </div>
    </template>
  </component>
  <teleport to="#space__widget-menu">
    <div v-if="widget.state.selected">
      <label>
        <span>URL</span>
        <input type="url" class="border border-gray-200" v-model="url" @blur="handleUrlChange" />
      </label>
      <label>
        <span>Style</span>
        <select v-model="widget.content.style" class="border border-gray-200">
          <option v-for="style in styleOptions" :key="style" :value="style">{{ style }}</option>
        </select>
      </label>
      <div v-if="widget.content.style === ELinkWidgetStyle.ICON">
        <label>
          <span>Use Custom Icon?</span>
          <input type="checkbox" v-model="widget.content.useCustomIcon" />
        </label>
        <label v-if="widget.content.useCustomIcon">
          <span>Icon</span>
          <select v-model="widget.content.icon" class="border border-gray-200">
            <option v-for="icon in supportedIcons" :key="icon" :value="icon">{{ icon }}</option>
          </select>
        </label>
      </div>
      <div v-if="widget.content.style !== ELinkWidgetStyle.ICON">
        <label>
          <span>Show image</span>
          <input type="checkbox" v-model="widget.content.showImage" />
        </label>
        <label>
          <span>Show title</span>
          <input type="checkbox" v-model="widget.content.showTitle" />
        </label>
        <label>
          <span>Show description</span>
          <input type="checkbox" v-model="widget.content.showDescription" />
        </label>
        <label>
          <span>Show URL</span>
          <input type="checkbox" v-model="widget.content.showUrl" />
        </label>
      </div>
    </div>
  </teleport>
</template>

<style scoped>

</style>
