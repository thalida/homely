import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { cloneDeep, filter } from 'lodash'
import { useWidgetStore } from '@/stores/widget'
import { useUserStore } from '@/stores/user'
import type { IWidgets } from '@/types/widget'
import type { ISpace, ISpaceResponse, ISpaces } from '@/types/space'
import { getSpace, createSpace as createSpaceReq, getSpaces, toggleSpaceBookmark } from '@/api/space'

export const useSpaceStore = defineStore('space', () => {
  const widgetStore = useWidgetStore()
  const userStore = useUserStore()
  const collection: Ref<ISpaces> = ref({})
  const defaultSpace = ref('')
  const backupWidgets: Ref<IWidgets> = ref({})
  const isEditMode: Ref<boolean> = useLocalStorage('homely/space/isEditMode', false)
  const homepageSpaces = ref<ISpace[]>([])

  const mySpaces = computed(() => {
    const user = userStore.user

    if (user === null) {
      return []
    }

    const userId = user.pk
    return filter(collection.value, (space) => space.owner === userId)
  })


  async function fetchHomepageSpaces() {
    const spaces = await getSpaces({ is_homepage: true })
    homepageSpaces.value = spaces

    for (const space of spaces) {
      addSpace(space)
    }
  }

  function initSpaces(
      spaces: ISpaceResponse[],
      setDefault = false,
    ) {
    for (const space of spaces) {
      addSpace(space)
    }

    if (setDefault && spaces.length > 0) {
      const defaultUid = spaces[0].uid
      defaultSpace.value = defaultUid
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

    return collection.value[spaceRes.uid]
  }

  function addSpace(space: ISpaceResponse) {
    collection.value[space.uid] = {
      uid: space.uid,
      name: space.name,
      owner: space.owner,
      created_at: space.created_at,
      updated_at: space.updated_at,
      is_bookmarked: space.is_bookmarked,
    }

    if (typeof space.widgets !== 'undefined' && space.widgets !== null) {
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

  async function toggleBookmark(spaceUid: string) {
    const user = userStore.user
    if (!user) {
      return
    }

    await toggleSpaceBookmark(spaceUid)
  }

  return {
    isEditMode,
    setEditMode,
    toggleEditMode,
    collection,
    defaultSpace,
    fetchHomepageSpaces,
    homepageSpaces,
    mySpaces,
    initSpaces,
    fetchSpace,
    createSpace,
    createBackup,
    deleteBackup,
    resetFromBackup,
    toggleBookmark,
  }
})
