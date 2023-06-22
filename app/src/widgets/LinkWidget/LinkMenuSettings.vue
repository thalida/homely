<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { computed, ref, watchEffect } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import type { TLinkWidget } from './types'
import { ELinkWidgetStyle } from './constants'
import { getLinkByUrl } from '@/api/links'

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const widgetStore = useWidgetStore()

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId) as TLinkWidget;
})

const styleOptions = computed(() => {
  return Object.values(ELinkWidgetStyle)
})

const url = ref('')

watchEffect(() => {
  if (widget.value && widget.value.content !== null) {
    url.value = widget.value.content.url || ''
  }
})

async function getLink(url: string) {
  if (!url) {
    throw new Error('URL is required')
  }

  const link = await getLinkByUrl(url)

  return link
}

async function handleUrlChange() {
  const widget = widgetStore.getWidgetById(props.widgetId) as TLinkWidget
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

  markAsDirty()
}

function handleResetMetadata() {
  const widget = widgetStore.getWidgetById(props.widgetId) as TLinkWidget
  widget.content.metadata = cloneDeep(widget.original_link?.metadata || {})
  markAsDirty()
}

function markAsDirty() {
  if (!props.widgetId) {
    return
  }

  widgetStore.markWidgetAsDirty(props.widgetId)
}
</script>

<template>
    <div v-if="widget.state.selected">
      <label>
        <span>URL</span>
        <input type="url" class="border border-gray-200" v-model="url" @blur="handleUrlChange" />
      </label>
      <label>
        <span>Style</span>
        <select v-model="widget.content.style" @change="markAsDirty" class="border border-gray-200">
          <option v-for="style in styleOptions" :key="style" :value="style">{{ style }}</option>
        </select>
      </label>
      <label>
        <span>Custom Metadata</span>
        <input type="checkbox" v-model="widget.content.showCustomMetadata" @change="markAsDirty" />
      </label>
      <div v-if="widget.content.showCustomMetadata" class="flex flex-col">
        <label>
          <span>Icon</span>
          <input type="url" class="border border-gray-200" v-model="widget.content.metadata.icon" @change="markAsDirty" />
        </label>
        <label>
          <span>Title</span><br />
          <input type="text" class="border border-gray-200" v-model="widget.content.metadata.title" @change="markAsDirty" />
        </label>
        <label>
          <span>Description</span><br />
          <textarea class="border border-gray-200" v-model="widget.content.metadata.description" @change="markAsDirty"></textarea>
        </label>
        <button @click="handleResetMetadata">Reset</button>
      </div>
      <div v-if="widget.content.style !== ELinkWidgetStyle.ICON" class="flex flex-col">
        <label>
          <span>Show Icon</span>
          <input type="checkbox" v-model="widget.content.showIcon" @change="markAsDirty" />
        </label>
        <label>
          <span>Show image</span>
          <input type="checkbox" v-model="widget.content.showImage" @change="markAsDirty" />
        </label>
        <label>
          <span>Show title</span>
          <input type="checkbox" v-model="widget.content.showTitle" @change="markAsDirty" />
        </label>
        <label>
          <span>Show description</span>
          <input type="checkbox" v-model="widget.content.showDescription" @change="markAsDirty" />
        </label>
        <label>
          <span>Show URL</span>
          <input type="checkbox" v-model="widget.content.showUrl" @change="markAsDirty" />
        </label>
      </div>
    </div>
</template>

<style scoped>

</style>
