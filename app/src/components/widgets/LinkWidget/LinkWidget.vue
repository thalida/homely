<script setup lang="ts">
import axios from 'axios'
import { computed, ref } from 'vue'
import { EWidgetType, useWidgetStore, type IWidgetButton } from '@/stores/widget'

const props = defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const widgetStore = useWidgetStore()

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId)
})

const url = ref('')

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

function handleCancel() {
  url.value = ''
}
</script>

<template>
  <div>
    <div>
      {{  widget.content }}
    </div>
    <teleport to="#space__widget-menu">
      <div v-if="widget.state.selected">
        <label>
          <span>URL</span>
          <input type="url" class="border border-gray-200" v-model="url" />
        </label>
        <button @click="handleCancel">Cancel</button>
        <button @click="handleSubmit">Submit</button>
      </div>
    </teleport>
  </div>
</template>

<style scoped>

</style>
