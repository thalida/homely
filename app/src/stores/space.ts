import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useWidgetStore } from './widget'
import { useUserStore } from './user'
import type { IWidgets } from '@/types/widget'
import { cloneDeep } from 'lodash'
import axios from 'axios'
import type { ISpaces } from '@/types/space'

export const useSpaceStore = defineStore('space', () => {
  const userStore = useUserStore()
  const widgetStore = useWidgetStore()
  const collection: Ref<ISpaces> = ref({})
  const backupWidgets: Ref<IWidgets> = ref({})
  const isEditMode: Ref<boolean> = useLocalStorage('homely/space/isEditMode', false)

  async function fetchSpace(spaceId: string) {
    const spaceRes = await axios.get(`http://localhost:8000/api/spaces/${spaceId}/`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`,
      },
    })

    collection.value[spaceId] = {
      uid: spaceRes.data.uid,
      name: spaceRes.data.name,
      owner: spaceRes.data.owner,
      created_at: spaceRes.data.created_at,
      updated_at: spaceRes.data.updated_at,
    }

    const widgets = spaceRes.data.widgets.map((widget: any) => {
      const updatedWidget = {
        ...widget,
        state: {
          selected: false,
          draft: false,
          deleted: false,
          temporary: false,
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
