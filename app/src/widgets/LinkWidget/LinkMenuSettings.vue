<script setup lang="ts">
import axios from 'axios'
import { cloneDeep } from 'lodash'
import { computed, ref, watchEffect } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { useUserStore } from '@/stores/user'
import type { TLinkWidget } from './types'
import { ELinkWidgetStyle } from './enums'

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const userStore = useUserStore()
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
}

function handleResetMetadata() {
  const widget = widgetStore.getWidgetById(props.widgetId) as TLinkWidget
  widget.content.metadata = cloneDeep(widget.original_link?.metadata || {})
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
</template>

<style scoped>

</style>
