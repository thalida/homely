<script setup lang="ts">
import { computed } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import { ImageIcon } from 'lucide-vue-next'

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
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex w-full h-full cursor-pointer"
  >
    <img v-if="widget.content.url" :src="widget.content.url" />
    <ImageIcon v-else />
  </div>
  <teleport to="#space__widget-menu">
    <div v-if="widget.state.selected">
      <label>
        <span>URL</span>
        <input type="url" class="border border-gray-200" v-model="widget.content.url" />
      </label>
    </div>
  </teleport>
</template>

<style scoped>

</style>
