<script setup lang="ts">
import axios from 'axios'
import { computed, ref, watchEffect } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { Link } from 'lucide-vue-next'
import { useSpaceStore } from '@/stores/space'
import type { ILinkWidget } from '@/types/widget'
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

const isEditing = computed(() => {
  return spaceStore.isEditMode
})

const wrapperEl = computed(() => {
  return isEditing.value ? 'div' : 'a'
});

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId) as ILinkWidget;
})
const metadata = computed(() => {
  if (!widget.value) {
    return {}
  }

  if (widget.value.content === null) {
    return {}
  }

  return widget.value.content.metadata || {}
})

const isSelected = computed(() => {
  return widget.value.state.selected;
})

const supportedIcons = computed(() => {
  return Object.keys(iconTags)
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

async function handleSubmit() {
  const metadata = await getMetadata(url.value)
  widgetStore.updateWidget(props.widgetId, {
    content: {
      url: url.value,
      metadata,
    },
  })
}
</script>

<template>
  <component
    :is="wrapperEl"
    v-bind="$attrs"
    class="flex w-full h-full cursor-pointer"
    :class="{
      'bg-blue-100': isSelected,
      'bg-slate-100': !isSelected,
      'justify-center items-center': widget.style.id === 'icon',
    }"
    :href="widget.content ? widget.content.url : null"
    target="_blank"
  >
    <template v-if="widget.style.id === 'icon'">
      <img v-if="metadata.icon" :src="metadata.icon" />
      <img v-else :src="`https://unpkg.com/lucide-static@latest/icons/${widget.content.icon}.svg`" />
    </template>
  </component>
  <teleport to="#space__widget-menu">
    <div v-if="widget.state.selected">
      <label>
        <span>URL</span>
        <input type="url" class="border border-gray-200" v-model="url" />
      </label>
      <label>
        <span>Icon</span>
        <select v-model="widget.content.icon" class="border border-gray-200">
          <option v-for="icon in supportedIcons" :key="icon" :value="icon">{{ icon }}</option>
        </select>
      </label>
      <button class="bg-green-200 p-2" @click="handleSubmit">Submit</button>
    </div>
  </teleport>
</template>

<style scoped>

</style>
