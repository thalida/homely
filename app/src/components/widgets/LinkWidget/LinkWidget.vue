<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useWidgetStore } from '@/stores/widget'
import { ELinkWidgetStyle, type ILinkWidget } from '@/types/widget'
import iconTags from 'lucide-static/tags.json'

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const widgetStore = useWidgetStore()

const linkEl = ref(null)

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId) as ILinkWidget;
})

const isSelected = computed(() => {
  return widget.value.state.selected;
})

const width = ref()
const height = ref()
const dimensionDiff = computed(() => {
  if (!width.value || !height.value) {
    return 0
  }

  return Math.abs(width.value - height.value)
})
const selectedStyle = computed(() => {
  if (dimensionDiff.value < 10) {
    return ELinkWidgetStyle.SQUARE
  }

  if (width.value > height.value) {
    return ELinkWidgetStyle.FLAG
  }

  return ELinkWidgetStyle.CARD
})

useResizeObserver(linkEl, (entries) => {
  const entry = entries[0]
  width.value = entry.contentRect.width
  height.value = entry.contentRect.height
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

onMounted(() => {
  console.log(widget.value.content)
})
</script>

<template>
  <a
    ref="linkEl"
    v-bind="$attrs"
    class="flex w-full h-full cursor-pointer"
    :class="{
      'bg-blue-100': isSelected,
      'bg-slate-100': !isSelected,
      'justify-center items-center': selectedStyle === ELinkWidgetStyle.SQUARE,
    }"
    :href="widget.content.url ? widget.content.url : ''"
    target="_blank"
  >
    <template v-if="selectedStyle === ELinkWidgetStyle.CARD">
      <img :src="widget.content.metadata?.image" :alt="widget.content.metadata['image:alt']" />
      <img :src="selectedIconUrl" />
      <span>{{  widget.content.metadata?.title || widget.content.url }}</span>
    </template>
    <template v-else-if="selectedStyle === ELinkWidgetStyle.FLAG">
      <img :src="widget.content.metadata?.image" :alt="widget.content.metadata['image:alt']" />
      <img :src="selectedIconUrl" />
      <span>{{ widget.content.metadata?.title || widget.content.url }}</span>
    </template>
    <template v-else>
      <img :src="selectedIconUrl" />
    </template>
  </a>
  <teleport to="#space__widget-menu">
    <div v-if="widget.state.selected">
      <label>
        <span>URL</span>
        <input type="url" class="border border-gray-200" v-model="url" @blur="handleUrlChange" />
      </label>
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
  </teleport>
</template>

<style scoped>

</style>
