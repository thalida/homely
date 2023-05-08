import { v4 as uuidv4 } from 'uuid';
import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { PartialDeep } from 'type-fest'
import { merge, cloneDeep } from 'lodash'
import { type TWidgetType, TEXT_WIDGET_KEY } from '@/components/widgets'

export interface IWidget {
  id: string
  type: TWidgetType
  content: Record<string, any>
  isSelected: boolean
  isSelectedGroup: boolean
  styles: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface IWidgets {
  [key: string]: IWidget
}

export const useWidgetStore = defineStore('widget', () => {
  const collection: Ref<IWidgets> = ref({
    '1': {
      id: '1',
      type: TEXT_WIDGET_KEY,
      content: { value: 'widget 1' },
      isSelected: false,
      isSelectedGroup: false,
      styles: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      }
    },
    '2': {
      id: '2',
      type: TEXT_WIDGET_KEY,
      content: { value: 'widget 2' },
      isSelected: false,
      isSelectedGroup: false,
      styles: {
        x: 100,
        y: 100,
        width: 200,
        height: 200
      }
    },
    '3': {
      id: '3',
      type: TEXT_WIDGET_KEY,
      content: { value: 'widget 3' },
      isSelected: false,
      isSelectedGroup: false,
      styles: {
        x: 300,
        y: 200,
        width: 200,
        height: 400
      }
    },
    '4': {
      id: '4',
      type: TEXT_WIDGET_KEY,
      content: { value: 'widget 4' },
      isSelected: false,
      isSelectedGroup: false,
      styles: {
        x: 400,
        y: 0,
        width: 200,
        height: 200
      }
    },
    '5': {
      id: '5',
      type: TEXT_WIDGET_KEY,
      content: { value: 'widget 5' },
      isSelected: false,
      isSelectedGroup: false,
      styles: {
        x: 750,
        y: 0,
        width: 300,
        height: 300
      }
    }
  });
  const backupCopy: Ref<IWidgets | null> = ref(null);

  const widgetKeys = computed(() => Object.keys(collection.value))
  const getWidgetById = computed(() => (id: string) => collection.value[id])

  function createBackup() {
    backupCopy.value = cloneDeep(collection.value);
  }

  function deleteBackup() {
    backupCopy.value = null;
  }

  function resetFromBackup() {
    if (!backupCopy.value) return;

    collection.value = cloneDeep(backupCopy.value);
    backupCopy.value = null;
  }

  function createWidget(widgetInput: Omit<IWidget, 'id'>) {
    const widget: IWidget = {
      id: uuidv4(),
      ...widgetInput,
    }
    collection.value[widget.id] = widget;
    return collection.value[widget.id];
  }

  function updateWidget(id: string, widget: PartialDeep<IWidget>) {
    collection.value[id] = merge(collection.value[id], widget);
    return collection.value[id];
  }


  return {
    collection,
    widgetKeys,

    getWidgetById,

    createBackup,
    deleteBackup,
    resetFromBackup,

    createWidget,
    updateWidget,
  }
})
