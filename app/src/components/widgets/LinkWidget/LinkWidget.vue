<script setup lang="ts">
import axios from 'axios'
import { computed, ref, watchEffect } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { ELinkWidgetStyle, type ILinkWidget } from '@/types/widget'
import { useSpaceStore } from '@/stores/space'
import { useUserStore } from '@/stores/user'
import { clone, cloneDeep } from 'lodash'

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const userStore = useUserStore()
const spaceStore = useSpaceStore()
const widgetStore = useWidgetStore()

const linkEl = ref(null)

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId) as ILinkWidget;
})

const isEditing = computed(() => {
  return spaceStore.isEditMode
})

const styleOptions = computed(() => {
  return Object.values(ELinkWidgetStyle)
})

const metadata = computed(() => {
  if (!widget.value) {
    return {}
  }

  const originalMetadata = widget.value.original_link?.metadata || {}

  if (widget.value.content.showCustomMetadata) {
    return Object.assign({}, originalMetadata, widget.value.content.metadata)
  }

  return originalMetadata
})

const url = ref('')

watchEffect(() => {
  if (widget.value && widget.value.content !== null) {
    url.value = widget.value.content.url || ''
  }
})

async function getLink(url: string) {
  if (!url) {
    return null
  }

  const apiUrl = `http://localhost:8000/api/links/`
  const res = await axios.post(
    apiUrl,
    {
      url,
    },
    {
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`,
      },
    }
  )

  return res.data
}

async function handleUrlChange() {
  const widget = widgetStore.getWidgetById(props.widgetId) as ILinkWidget
  try {
    const link = await getLink(url.value)
    widget.content.url = url.value
    widget.content.metadata = link.metadata
    widget.link = link.uid
    widget.original_link = link
  } catch (e) {
    widget.content.url = url.value
    widget.content.metadata = {}
    widget.link = null
    widget.original_link = null
  }
}

function handleResetMetadata() {
  const widget = widgetStore.getWidgetById(props.widgetId) as ILinkWidget
  widget.content.metadata = cloneDeep(widget.original_link?.metadata || {})
}
</script>

<template>
  <component
    :is="isEditing ? 'div' : 'a'"
    ref="linkEl"
    v-bind="$attrs"
    class="flex cursor-pointer"
    :class="{
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
        backgroundImage:`url(${metadata.icon})`,
      }"
    ></div>
    <template v-else>
      <div
        v-if="widget.content.showImage"
        class="bg-cover bg-no-repeat bg-center shrink-0 from-indigo-500 via-purple-500 to-pink-500"
        :class="{
          'fixed inset-y-0 left-0': widget.content.style === ELinkWidgetStyle.FLAG,
          'inset-x-0 top-0 grow': widget.content.style === ELinkWidgetStyle.CARD,
          'w-1/3 rounded-l-2xl': widget.content.style === ELinkWidgetStyle.FLAG && (widget.content.showDescription || widget.content.showTitle || widget.content.showUrl),
          'h-1/2 rounded-t-2xl': widget.content.style === ELinkWidgetStyle.CARD && (widget.content.showDescription || widget.content.showTitle || widget.content.showUrl),
          'w-full h-full rounded-2xl': !widget.content.showDescription && !widget.content.showTitle && !widget.content.showUrl,
        }"
        :style="{
          backgroundImage: metadata.image ? `url(${metadata.image})` : 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
        }"
        :title="metadata['image:alt'] || widget.content.url"
      ></div>
      <div
        v-if="widget.content.showDescription || widget.content.showTitle || widget.content.showUrl || widget.content.showIcon"
        class="flex flex-col p-4 my-auto space-y-2"
        :class="{
          'w-2/3': widget.content.style === ELinkWidgetStyle.FLAG && widget.content.showImage,
          'w-full': widget.content.style === ELinkWidgetStyle.CARD || (widget.content.style === ELinkWidgetStyle.FLAG && !widget.content.showImage),
        }"
      >
        <div v-if="widget.content.showTitle || widget.content.showIcon" class="flex flex-row space-x-2 items-center">
          <div
            v-if="metadata.icon && widget.content.showIcon"
            class="bg-cover bg-no-repeat bg-center w-6 h-6 shrink-0"
            :style="{
              backgroundImage: `url(${metadata.icon})`,
            }"
          ></div>
          <span v-if="widget.content.showTitle" class="font-bold text-lg truncate">{{  metadata.title || widget.content.url || "Sample Link" }}</span>
        </div>
        <p v-if="widget.content.showDescription" class="text-sm">{{ metadata.description || "Enter a url on the sidebar menu to create a link" }}</p>
        <p v-if="widget.content.showUrl" class="text-xs truncate">{{ widget.content.url || "https://link.example.com" }}</p>
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
      <label>
        <span>Custom Metadata</span>
        <input type="checkbox" v-model="widget.content.showCustomMetadata" />
      </label>
      <div v-if="widget.content.showCustomMetadata" class="flex flex-col">
        <label>
          <span>Icon</span>
          <input type="url" class="border border-gray-200" v-model="widget.content.metadata.icon" />
        </label>
        <label>
          <span>Title</span><br />
          <input type="text" class="border border-gray-200" v-model="widget.content.metadata.title" />
        </label>
        <label>
          <span>Description</span><br />
          <textarea class="border border-gray-200" v-model="widget.content.metadata.description"></textarea>
        </label>
        <button @click="handleResetMetadata">Reset</button>
      </div>
      <div v-if="widget.content.style !== ELinkWidgetStyle.ICON" class="flex flex-col">
        <label>
          <span>Show Icon</span>
          <input type="checkbox" v-model="widget.content.showIcon" />
        </label>
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
