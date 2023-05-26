import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { cloneDeep } from 'lodash'
import { useWidgetStore } from '@/stores/widget'
import type { IWidgets } from '@/types/widget'
import type { ISpace, ISpaceResponse, ISpaces } from '@/types/space'
import { getSpace, createSpace as createSpaceReq } from '@/api/space'

export const useSpaceStore = defineStore('space', () => {
  const widgetStore = useWidgetStore()
  const collection: Ref<ISpaces> = ref({})
  const activeSpace = ref('')
  const backupWidgets: Ref<IWidgets> = ref({})
  const isEditMode: Ref<boolean> = useLocalStorage('homely/space/isEditMode', false)

  function initSpaces(spaces: ISpace[]) {
    collection.value = {}

    for (const space of spaces) {
      collection.value[space.uid] = { ...space }
    }

    if (spaces.length > 0) {
      activeSpace.value = spaces[0].uid
    }
  }

  async function fetchSpace(spaceId: string) {
    const spaceRes = await getSpace(spaceId)
    addSpace(spaceRes)
  }

  async function createSpace() {
    const randomName = Math.random().toString(36).substring(7)

    const spaceRes = await createSpaceReq(randomName)
    addSpace(spaceRes)
    activeSpace.value = spaceRes.uid
  }

  function addSpace(space: ISpaceResponse) {
    collection.value[space.uid] = {
      uid: space.uid,
      name: space.name,
      owner: space.owner,
      created_at: space.created_at,
      updated_at: space.updated_at,
    }

    const widgets = space.widgets.map((widget: any) => {
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

    widgetStore.setSpaceWidgets(space.uid, widgets)
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
    collection,
    activeSpace,
    initSpaces,
    fetchSpace,
    createSpace,
    createBackup,
    deleteBackup,
    resetFromBackup,
  }
})
