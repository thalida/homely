<script setup lang="ts">
import { computed, nextTick } from 'vue';
import { cloneDeep, filter } from 'lodash';
import { SettingsIcon } from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';
import { useSpaceStore } from '@/stores/space';
import { useWidgetStore } from '@/stores/widget';
import { useThemeStore } from '@/stores/theme';
import type { IWidget } from '@/types/widget';
import { widgetMenuBtnComponents } from '@/widgets'
import { EAppTheme } from '@/enums/themes';

const userStore = useUserStore();
const spaceStore = useSpaceStore();
const widgetsStore = useWidgetStore();
const themeStore = useThemeStore();

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
});

const emits = defineEmits<{
  (e: 'editModeCancel'): void,
  (e: 'editModeStart'): void,
  (e: 'editModeDone'): void,
}>();

const selectedWidgets = computed(() => {
  const widgetIds = widgetsStore.activeWidgetsBySpace[props.spaceId];
  return filter(widgetIds, (widgetId) => {
    const widget = widgetsStore.getWidgetById(widgetId);
    return widget.state.selected;
  });
});

const numSelectedWidgets = computed(() => {
  return selectedWidgets.value.length;
});

const supportedAppThemes = computed(() => {
  return Object.values(EAppTheme);
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
    widgetsStore.draftDeleteWidget(widget);
  }
}

async function handleWidgetMenuBtnClicked(defaultWidget: unknown) {
  const maxPosition = widgetsStore.maxLayoutPositionBySpace[props.spaceId]
  const newWidgetInput: IWidget = cloneDeep(defaultWidget) as IWidget
  newWidgetInput.layout.x = maxPosition.x
  newWidgetInput.layout.y = maxPosition.y

  const widget = widgetsStore.draftCreateWidget(props.spaceId, newWidgetInput)

  await nextTick()
  await nextTick()

  scrollToWidget(widget)
}

function scrollToWidget(widget: IWidget) {
  const widgetElement = document.getElementById(`space-widget-${widget.uid}`)
  if (!widgetElement) {
    return
  }

  widgetElement.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
  })
}
</script>

<template>
  <div ref="menuRef" class="space-layout__menu fixed space-x-2 top-0 right-0 overflow-auto bg-slate-200 z-10 bg-opacity-90"
  :class="{
    'h-auto w-auto p-0 m-4': !spaceStore.isEditMode,
    'h-full w-80 p-4 m-0': spaceStore.isEditMode,
  }">
    <div>
      <button v-if="spaceStore.isEditMode" @click="handleEditModeCancel" class="p-2 bg-slate-400">Cancel</button>
      <button v-if="spaceStore.isEditMode" @click="handleEditModeToggle" class="p-2 bg-green-300">
        Save
      </button>
      <button v-else @click="handleEditModeToggle" class="p-2 bg-green-300">
        <SettingsIcon />
      </button>
      <select v-model="themeStore.appTheme">
        <option v-for="theme in supportedAppThemes" :key="theme" :value="theme">{{ theme }}</option>
      </select>
    </div>
    <template v-if="spaceStore.isEditMode">
      <button @click="userStore.logout()">Logout</button>
      {{ numSelectedWidgets }} selected:
      <button @click="handleDelete" class="p-2 bg-red-400 disabled:opacity-50" :disabled="numSelectedWidgets === 0">Delete</button>
      <component
        class="p-2 bg-blue-400"
        v-for="component in widgetMenuBtnComponents"
        :key="component.name"
        :is="component"
        @widgetMenuBtnClicked="handleWidgetMenuBtnClicked"
      />
    </template>
    <div id="space__shared-widget-menu"></div>
    <div id="space__widget-menu"></div>
  </div>
</template>

<style scoped>
</style>
