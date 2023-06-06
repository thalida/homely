<script setup lang="ts">
import { ESpaceTheme } from '@/constants/theme';
import { useWidgetStore } from '@/stores/widget';
import { computed, ref } from 'vue';


const widgetStore = useWidgetStore()

const props = defineProps({
  widgetId: {
    type: String,
    required: true
  },
})

const widget = computed(() => {
  return widgetStore.getWidgetById(props.widgetId)
})

const supportedColors = ref(Object.values(ESpaceTheme))
</script>

<template>
  <div>
    <label>
      <span>Card Color</span>
      <select
        v-model="widget.card_style.background_color"
        class="block w-full mt-1"
      >
        <option
          v-for="color in supportedColors"
          :key="color"
          :value="color"
        >
          {{ color }}
        </option>
      </select>
    </label>

  </div>
</template>

<style scoped>

</style>
