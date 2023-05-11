import { v4 as uuidv4 } from 'uuid';
import { computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { PartialDeep } from 'type-fest'
import { merge, cloneDeep } from 'lodash'
import { useLocalStorage } from '@vueuse/core'
import type { I } from 'vitest/dist/types-94cfe4b4';

export enum EWidgetType {
  LINK = 'link',
  TEXT = 'text',
}

export interface IWidget {
  id: string
  type: EWidgetType
  content: Record<string, any> | null
  state: IWidgetState
  style: IWidgetStyle
}

export interface IWidgetState {
  selected: boolean,
  temporary: boolean,
}

export interface IWidgetStyle {
  id: string
  label: string
  layout: Omit<IWidgetLayout, 'i' | 'x' | 'y'>
}

export interface IWidgets {
  [key: string]: IWidget
}

export interface IWidgetLayout {
  i: string
  x: number
  y: number
  w: number
  h: number
  static?: boolean
  preserveAspectRatio?: boolean
  isResizable?: boolean
}

export interface IWidgetButton extends Pick<IWidget, 'type' | 'content' | 'style'>{}

export const useWidgetStore = defineStore('widget', () => {
  const collection: Ref<IWidgets> = useLocalStorage('homely/widget/collection', {});
  const layout: Ref<IWidgetLayout[]> = useLocalStorage('homely/widget/layout', []);

  const backupCollection: Ref<IWidgets> = useLocalStorage('homely/widget/backupCollection', {});
  const backupLayout: Ref<IWidgetLayout[]> = useLocalStorage('homely/widget/backupLayout', []);

  const getWidgetById = computed(() => (id: string) => collection.value[id])
  const getWidgetLayoutById = computed(() => (id: string) => layout.value.find((item) => item.i === id))


  function createBackup() {
    backupCollection.value = cloneDeep(collection.value);
    backupLayout.value = cloneDeep(layout.value);
  }

  function deleteBackup() {
    backupCollection.value = {};
    backupLayout.value = [];
  }

  function resetFromBackup() {
    collection.value = cloneDeep(backupCollection.value);
    layout.value = cloneDeep(backupLayout.value);

    deleteBackup()
  }

  function createWidget(widgetInput: Omit<IWidget, 'id' | 'state'>, widgetLayout: PartialDeep<IWidgetLayout> = {}) {
    const newWidget: IWidget = {
      ...widgetInput,
      id: uuidv4(),
      state: {
        selected: true,
        temporary: false,
      },
    }

    const newWidgetLayout: IWidgetLayout = {
      i: newWidget.id,
      w: widgetLayout.w || 1,
      h: widgetLayout.h || 1,
      x: (layout.value.length * 2) % 12,
      y: layout.value.length + 12,
      ...widgetLayout,
    }

    collection.value[newWidget.id] = newWidget;
    layout.value.push(newWidgetLayout);

    return {
      widget: collection.value[newWidget.id],
      layout: layout.value[layout.value.length - 1],
    }
  }

  function updateWidget(id: string, widget: PartialDeep<IWidget>) {
    if (!collection.value[id]) {
      return;
    }

    collection.value[id] = merge(collection.value[id], widget);
    return collection.value[id];
  }

  function updateAllWidgets(settings: PartialDeep<IWidget>) {
    Object.keys(collection.value).forEach((id) => {
      collection.value[id] = merge(collection.value[id], settings);
    })
  }

  function deleteWidget(id: string) {
    const index = layout.value.findIndex((item) => item.i === id);
    if (index > -1) {
      layout.value.splice(index, 1);
    }

    delete collection.value[id];
  }

  return {
    collection,
    layout,

    getWidgetById,
    getWidgetLayoutById,

    createBackup,
    deleteBackup,
    resetFromBackup,

    createWidget,
    updateWidget,
    deleteWidget,
    updateAllWidgets,
  }
})
