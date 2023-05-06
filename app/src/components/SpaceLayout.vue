<script setup lang="ts">
import { type Ref, ref } from 'vue';
import SpaceWidget from './SpaceWidget.vue';

const widgets: Ref<any[]> = ref([
  {
    id: 1,
    content: 'widget 1',
  },
  {
    id: 2,
    content: 'widget 2',
  },
  {
    id: 3,
    content: 'widget 3',
  },
]);
</script>
<template>
  <div>
    <SpaceWidget v-for="widget in widgets" :key="widget.id" :widget="widget">
      {{ widget.content }}
    </SpaceWidget>
  </div>
</template>

<style scoped>

</style>
