<script setup lang="ts">
import SpaceWidget from './SpaceWidget.vue';

const props = defineProps({
  itemId: {
    type: String,
    required: true
  }
})

</script>

<template>
  <div class="grid-stack-item">
    <div class="grid-stack-item-content">
      <SpaceWidget :widgetId="props.itemId" />
    </div>
  </div>
</template>

<style scoped>

</style>
