import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { PartialDeep } from 'type-fest'
import { merge, cloneDeep } from 'lodash'

export interface IWidget {
  id: string
  content: string
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
      content: 'widget 1',
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
      content: 'widget 2',
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
      content: 'widget 3',
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
      content: 'widget 4',
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
      content: 'widget 5',
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

  function updateWidget(id: string, widget: PartialDeep<IWidget>) {
    collection.value[id] = merge(collection.value[id], widget);
  }


  return {
    collection,
    widgetKeys,

    getWidgetById,

    createBackup,
    deleteBackup,
    resetFromBackup,

    updateWidget,
  }
})
