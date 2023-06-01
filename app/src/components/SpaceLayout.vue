<script setup lang="ts">
import { provide, ref } from 'vue'
import { useSpaceStore } from '@/stores/space'
import { useWidgetStore } from '@/stores/widget'
import SpaceMenu from './SpaceMenu.vue'
import SpaceGrid from './SpaceGrid.vue'

const spaceStore = useSpaceStore()
const widgetsStore = useWidgetStore()

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
})

const spaceRef = ref<HTMLElement>()
const spaceGridRef = ref<InstanceType<typeof SpaceGrid>>()
const spaceMenuRef = ref<InstanceType<typeof SpaceMenu>>()

function handleSpaceClick(e: Event) {
  const target = e.target as HTMLElement
  const isSpaceLayout = target.classList.contains('space-layout')
  const isSpaceGrid = target.classList.contains('space-layout__grid')

  if (isSpaceGrid || isSpaceLayout) {
    widgetsStore.unselectAllWidgets(props.spaceId)
  }
}

provide('spaceGridRef', spaceGridRef)
</script>

<template>
  <div
    ref="spaceRef"
    class="space-layout flex relative"
    :class="{
      'is-editing': spaceStore.isEditMode,
    }"
    @click="handleSpaceClick"
  >
    <div class="space-layout__background w-full h-full fixed top-0 left-0"></div>
    <SpaceGrid
      ref="spaceGridRef"
      class="space-layout__grid"
      :spaceId="props.spaceId" />
    <SpaceMenu
      ref="spaceMenuRef"
      class="space-layout__menu shrink-0"
      :spaceId="props.spaceId" />
  </div>
</template>

<style scoped>
.space-layout {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
.is-editing .space-layout__grid {
  margin-right: 320px;
}

.space-layout__background {
	background-size: 400% 400%;
	animation: gradient 10s ease infinite;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: 400% 400%;
    animation: gradient 10s ease infinite;
  }
}

.space-layout__background,
.light .space-layout__background {
  background-color: rgb(229 255 221);
  background-image: linear-gradient(0deg, rgb(229 255 221) , rgb(255 255 255 / 0%));
  &:before {
    background-image: linear-gradient(120deg, rgb(201 255 252 / 60%) , rgb(255 255 255 / 0%));
  }
  &:after {
    background-image: linear-gradient(240deg, rgb(255 231 233 / 60%) , rgb(255 255 255 / 0%));
  }
}

.dark .space-layout__background {
  background-color: rgb(3 0 34);
  background-image: linear-gradient(0deg, rgb(3 0 34) , rgb(0 0 0 / 0%));

  &:before {
    background-image: linear-gradient(120deg, rgb(62 39 76 / 60%) , rgb(0 0 0 / 0%));
  }
  &:after {
    background-image:linear-gradient(240deg, rgb(0 33 30 / 60%) , rgb(0 0 0 / 0%));
  }
}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

</style>
