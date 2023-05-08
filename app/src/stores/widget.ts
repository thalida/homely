import { v4 as uuidv4 } from 'uuid';
import { computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { PartialDeep } from 'type-fest'
import { merge, cloneDeep } from 'lodash'
import type { TWidgetType } from '@/components/widgets'
import { useLocalStorage } from '@vueuse/core'

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
  const collection: Ref<IWidgets> = useLocalStorage('homely/widget/collection', {});
  const backupCopy: Ref<IWidgets> = useLocalStorage('homely/widget/backupCopy', {});

  const widgetKeys = computed(() => Object.keys(collection.value))
  const getWidgetById = computed(() => (id: string) => collection.value[id])

  function createBackup() {
    backupCopy.value = cloneDeep(collection.value);
  }

  function deleteBackup() {
    backupCopy.value = {};
  }

  function resetFromBackup() {
    collection.value = cloneDeep(backupCopy.value);
    backupCopy.value = {};
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
