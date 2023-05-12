<script setup lang="ts">
import axios from 'axios'
import { computed, ref, watchEffect } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { Link } from 'lucide-vue-next'
import { useSpaceStore } from '@/stores/space'

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
  return widgetStore.getWidgetById(props.widgetId)
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

const url = ref('')

watchEffect(() => {
  if (widget.value && widget.value.content !== null) {
    url.value = widget.value.content.url
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
      <Link v-else />
    </template>
  </component>
  <teleport to="#space__widget-menu">
    <div v-if="widget.state.selected">
      <label>
        <span>URL</span>
        <input type="url" class="border border-gray-200" v-model="url" />
      </label>
      <button class="bg-green-200 p-2" @click="handleSubmit">Submit</button>
    </div>
  </teleport>
</template>

<style scoped>

</style>
