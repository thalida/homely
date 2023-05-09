<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import ModalLayout from '../ModalLayout.vue';
import { LINK_WIDGET_KEY } from '@/components/widgets';
import { useWidgetStore, type IWidget } from '@/stores/widget';

const widgetStore = useWidgetStore()

defineProps({
  widgetId: {
    type: String,
    required: false,
    default: null
  }
})

const emits = defineEmits<{
  (e: 'submit', widget: IWidget): void
  (e: 'cancel'): void
}>();

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
  const widget = widgetStore.createWidget({
    type: LINK_WIDGET_KEY,
    content: {
      url: url.value,
      metadata,
    },
    isSelected: false,
    isSelectedGroup: false,
    styles: {
      x: 0,
      y: 0,
      width: 300,
      height: 300,
      zIndex: 0,
    }
  })
  emits('submit', widget)
}

function handleCancel() {
  url.value = ''
  emits('cancel')
}
</script>

<template>
  <ModalLayout @submit="handleSubmit" @cancel="handleCancel">
    <label>
      <span>URL</span>
      <input type="url" class="border border-gray-200" v-model="url" />
    </label>
  </ModalLayout>
</template>

<style scoped>

</style>
