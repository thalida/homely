import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { cloneDeep } from 'lodash'
import { useWidgetStore } from '@/stores/widget'
import type { IWidgets } from '@/types/widget'
import type { ISpaces } from '@/types/space'
import { getSpace } from '@/api/space'

export const useSpaceStore = defineStore('space', () => {
  const widgetStore = useWidgetStore()
  const collection: Ref<ISpaces> = ref({})
  const backupWidgets: Ref<IWidgets> = ref({})
  const isEditMode: Ref<boolean> = useLocalStorage('homely/space/isEditMode', false)

  async function fetchSpace(spaceId: string) {
    const spaceRes = await getSpace(spaceId)

    collection.value[spaceId] = {
      uid: spaceRes.uid,
      name: spaceRes.name,
      owner: spaceRes.owner,
      created_at: spaceRes.created_at,
      updated_at: spaceRes.updated_at,
    }

    const widgets = spaceRes.widgets.map((widget: any) => {
      const updatedWidget = {
        ...widget,
        state: {
          selected: false,
          dirty: false,
          deleted: false,
          new: false,
        },
      }
      updatedWidget.layout.i = updatedWidget.uid
      return updatedWidget
    })

    widgetStore.setSpaceWidgets(spaceId, widgets)
  }

  function createBackup() {
    backupWidgets.value = cloneDeep(widgetStore.collection)
  }

  function deleteBackup() {
    backupWidgets.value = {}
  }

  function resetFromBackup() {
    widgetStore.collection = cloneDeep(backupWidgets.value)
    deleteBackup()
  }

  function toggleEditMode() {
    isEditMode.value = !isEditMode.value
  }

  function setEditMode(value: boolean) {
    isEditMode.value = value
  }

  return {
    isEditMode,
    setEditMode,
    toggleEditMode,
    createBackup,
    deleteBackup,
    resetFromBackup,
    fetchSpace,
  }
})
