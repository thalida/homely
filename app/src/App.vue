<script setup lang="ts">
import SpaceLayout from './components/SpaceLayout.vue';
import SpaceMoveable from './components/SpaceMoveable.vue';
</script>

<template>
   <main>
    <!-- <SpaceLayout /> -->
    <SpaceMoveable />
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
