<script setup lang="ts">
import { useSpaceStore } from '@/stores/space';
import { ref, computed, onBeforeUnmount, onMounted, type PropType } from 'vue';
import { widgetComponents, LINK_WIDGET_KEY, TEXT_WIDGET_KEY } from '@/components/widgets';
import { filter, throttle } from 'lodash';
import type { GridLayout } from 'grid-layout-plus';

const spaceStore = useSpaceStore();

// const props = defineProps({
//   wrapper: {
//     type: HTMLElement,
//     required: true
//   },
//   gridLayout: {
//     type: Object as PropType<InstanceType<typeof GridLayout>>,
//     required: true
//   }
// });

const emits = defineEmits<{
  (e: 'editModeCancel'): void
  (e: 'editModeStart'): void
  (e: 'editModeDone'): void
}>();

const activeWidgetComponentKey = ref<typeof LINK_WIDGET_KEY | typeof TEXT_WIDGET_KEY | null>(null);
const showModal = ref(false);

const selectedWidgets = computed(() => {
  return filter(spaceStore.widgets.collection, (w) => w.state.selected);
});
const numSelectedWidgets = computed(() => {
  return selectedWidgets.value.length;
});

function handleEditModeCancel() {
  spaceStore.setEditMode(false);
  emits('editModeCancel');
}
function handleEditModeToggle() {
  spaceStore.toggleEditMode();
  if (spaceStore.isEditMode) {
    emits('editModeStart');
  } else {
    emits('editModeDone');
  }
}

async function handleDelete() {
  for (const widget of selectedWidgets.value) {
    spaceStore.widgets.deleteWidget(widget.id);
  }
}

function handleAddLink() {
  activeWidgetComponentKey.value = LINK_WIDGET_KEY;
  showModal.value = true;
}

function handleAddModuleSubmit() {
  showModal.value = false;
  activeWidgetComponentKey.value = null;
}

// onMounted(() => {
//   document.addEventListener('dragover', syncMousePosition)
// })

// onBeforeUnmount(() => {
//   document.removeEventListener('dragover', syncMousePosition)
// })

// const mouseAt = { x: -1, y: -1 }
// const dropId = 'drop'
// const dragItem = { x: -1, y: -1, w: 2, h: 2, i: '' }

// function syncMousePosition(event: MouseEvent) {
//   mouseAt.x = event.clientX
//   mouseAt.y = event.clientY
// }

// const drag = throttle(() => {
//   const parentRect = props.wrapper?.getBoundingClientRect()

//   if (!parentRect || !props.gridLayout) return

//   const mouseInGrid =
//     mouseAt.x > parentRect.left &&
//     mouseAt.x < parentRect.right &&
//     mouseAt.y > parentRect.top &&
//     mouseAt.y < parentRect.bottom

//   if (mouseInGrid && !spaceStore.widgets.layout.find(item => item.i === dropId)) {
//     spaceStore.widgets.layout.push({
//       x: (spaceStore.widgets.layout.length * 2) % 12,
//       y: spaceStore.widgets.layout.length + 12, // puts it at the bottom
//       w: 2,
//       h: 2,
//       i: dropId
//     })
//   }

//   const index = spaceStore.widgets.layout.findIndex(item => item.i === dropId)

//   if (index !== -1) {
//     const item = props.gridLayout.getItem(dropId)

//     if (!item) return

//     try {
//       item.wrapper.style.display = 'none'
//     } catch (e) { }

//     Object.assign(item.state, {
//       top: mouseAt.y - parentRect.top,
//       left: mouseAt.x - parentRect.left
//     })
//     const newPos = item.calcXY(mouseAt.y - parentRect.top, mouseAt.x - parentRect.left)

//     if (mouseInGrid) {
//       props.gridLayout.dragEvent('dragstart', dropId, newPos.x, newPos.y, dragItem.h, dragItem.w)
//       dragItem.i = String(index)
//       dragItem.x = spaceStore.widgets.layout[index].x
//       dragItem.y = spaceStore.widgets.layout[index].y
//     } else {
//       props.gridLayout.dragEvent('dragend', dropId, newPos.x, newPos.y, dragItem.h, dragItem.w)
//       spaceStore.widgets.layout = spaceStore.widgets.layout.filter(item => item.i !== dropId)
//     }
//   }
// })

// function dragEnd() {
//   const parentRect = props.wrapper.getBoundingClientRect()

//   if (!parentRect || !props.gridLayout) return

//   const mouseInGrid =
//     mouseAt.x > parentRect.left &&
//     mouseAt.x < parentRect.right &&
//     mouseAt.y > parentRect.top &&
//     mouseAt.y < parentRect.bottom

//   if (mouseInGrid) {
//     alert(`Dropped element props:\n${JSON.stringify(dragItem, ['x', 'y', 'w', 'h'], 2)}`)
//     props.gridLayout.dragEvent('dragend', dropId, dragItem.x, dragItem.y, dragItem.h, dragItem.w)
//     spaceStore.widgets.layout = spaceStore.widgets.layout.filter(item => item.i !== dropId)
//   } else {
//     return
//   }

//   spaceStore.widgets.layout.push({
//     x: dragItem.x,
//     y: dragItem.y,
//     w: dragItem.w,
//     h: dragItem.h,
//     i: dragItem.i
//   })
//   props.gridLayout.dragEvent('dragend', dragItem.i, dragItem.x, dragItem.y, dragItem.h, dragItem.w)

//   const item = props.gridLayout.getItem(dropId)

//   if (!item) return

//   try {
//     item.wrapper.style.display = ''
//   } catch (e) { }
// }
</script>

<template>
  <div class="space-layout__menu fixed space-x-2 top-0 left-0 w-full p-4 bg-slate-200 z-10 bg-opacity-90">
    <button v-if="spaceStore.isEditMode" @click="handleEditModeCancel" class="p-2 bg-slate-400">Cancel</button>
    <button @click="handleEditModeToggle" class="p-2 bg-green-300">
      {{ spaceStore.isEditMode ? 'Save' : 'Edit' }}
    </button>
    <template v-if="spaceStore.isEditMode">
      {{ numSelectedWidgets }} selected:
      <button @click="handleDelete" class="p-2 bg-red-400 disabled:opacity-50" :disabled="numSelectedWidgets === 0">Delete</button>
    </template>
    <template v-if="spaceStore.isEditMode">
      <button @click="handleAddLink" class="p-2 bg-blue-400">Add Link</button>
    </template>
    <!-- <div
      class="droppable-element"
      draggable="true"
      unselectable="on"
      @drag="drag"
      @dragend="dragEnd"
    >
      Droppable Element (Drag me!)
    </div> -->
  </div>
  <teleport to="body">
    <component
      v-if="activeWidgetComponentKey"
      :is="widgetComponents[activeWidgetComponentKey].modal"
      :show="showModal"
      @submit="handleAddModuleSubmit"
      @cancel="showModal = false"
    />
  </teleport>
</template>

<style scoped>
</style>
