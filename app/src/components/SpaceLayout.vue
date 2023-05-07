<script setup lang="ts">
import { type Ref, ref } from 'vue';
import SpaceWidget from './SpaceWidget.vue';

const widgets: Ref<any[]> = ref([
  {
    id: 1,
    content: 'widget 1',
    x: 0,
    y: 0,
  },
  {
    id: 2,
    content: 'widget 2',
    x: 100,
    y: 100,
  },
  {
    id: 3,
    content: 'widget 3',
    x: 300,
    y: 200,
  },
]);
</script>
<template>
  <div class="space-layout">
    <SpaceWidget v-for="widget in widgets" :key="widget.id" :widget="widget">
      {{ widget.content }}
    </SpaceWidget>
  </div>
</template>

<style scoped>
.space-layout {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
</style>
