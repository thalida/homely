<script setup lang="ts">
import { ref } from 'vue'
import SpaceMenu from './SpaceMenu.vue'
import SpaceWidgetMenu from './SpaceWidgetMenu.vue'
import { ESidebarSection } from '@/constants/ui';
import { useSpaceStore } from '@/stores/space';

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})

const spaceStore = useSpaceStore()
const spaceMenuRef = ref<InstanceType<typeof SpaceMenu>>()
const spaceWidgetMenuRef = ref<InstanceType<typeof SpaceWidgetMenu>>()
</script>

<template>
  <div>
    <SpaceMenu
      v-if="spaceStore.sidebarOpenState[ESidebarSection.SPACE]"
      ref="spaceMenuRef"
      :spaceId="props.spaceId" />
    <SpaceWidgetMenu
      v-else-if="spaceStore.sidebarOpenState[ESidebarSection.WIDGET]"
      ref="spaceWidgetMenuRef"
      :spaceId="props.spaceId" />
  </div>
</template>

<style scoped>

</style>
