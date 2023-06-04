import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { cloneDeep, filter, omit, sortBy } from 'lodash'
import { useWidgetStore } from '@/stores/widget'
import { useUserStore } from '@/stores/user'
import type { IWidgets } from '@/types/widget'
import type { ISpace, ISpaceResponse, ISpaces } from '@/types/space'
import {
  getSpace,
  getSpaces,
  createSpace as createSpaceReq,
  updateSpace as updateSpaceReq,
  cloneSpace as cloneSpaceReq,
  deleteSpace as deleteSpaceReq,
  toggleSpaceBookmark,
} from '@/api/space'
import { randomItemFromArray } from '@/utils/array'
import { HOME_TERMS, SPACE_TERMS } from '@/constants/space'
import { updateUser } from '@/api/user'

export const useSpaceStore = defineStore('space', () => {
  const widgetStore = useWidgetStore()
  const userStore = useUserStore()
  const collection: Ref<ISpaces> = ref({})
  const backupSpaces: Ref<ISpaces> = ref({})
  const backupWidgets: Ref<IWidgets> = ref({})
  const isEditMode = ref(false)
  const homepageSpaces = ref<ISpace[]>([])
  const defaultSpace = computed(() => {
    const foundDefault = Object.values(collection.value).find((space) => space.is_default)
    return foundDefault ? foundDefault.uid : Object.keys(collection.value)[0]
  });


  const mySpaces = computed(() => {
    const user = userStore.user

    if (user === null) {
      return []
    }

    const userId = user.pk
    const mySpaces = filter(collection.value, (space) => space.owner === userId)
    return sortBy(mySpaces, (space) => !space.is_default)
  })

  const myBookmarkedSpaces = computed(() => {
    return filter(collection.value, (space) => space.is_bookmarked)
  })


  async function fetchHomepageSpaces() {
    const spaces = await getSpaces({ is_homepage: true })
    homepageSpaces.value = spaces

    for (const space of spaces) {
      addSpace(space)
    }
  }

  function initSpaces(spaces: ISpaceResponse[]) {
    for (const space of spaces) {
      addSpace(space)
    }
  }

  async function fetchSpace(spaceId: string) {
    const spaceRes = await getSpace(spaceId)
    addSpace(spaceRes)
  }

  async function createSpace() {
    const randomStarWord = randomItemFromArray(SPACE_TERMS)
    const randomHomeWord = randomItemFromArray(HOME_TERMS)
    const randomName = `${randomStarWord} ${randomHomeWord}`

    const spaceRes = await createSpaceReq(randomName)
    addSpace(spaceRes)

    return collection.value[spaceRes.uid]
  }

  async function updateSpace(spaceId: string) {
    const spaceRes = await updateSpaceReq(spaceId, collection.value[spaceId])
    addSpace(spaceRes)

    return collection.value[spaceRes.uid]
  }

  async function cloneSpace(spaceId: string) {
    const spaceRes = await cloneSpaceReq(spaceId)
    addSpace(spaceRes)

    return collection.value[spaceRes.uid]
  }

  async function deleteSpace(spaceId: string) {
    await deleteSpaceReq(spaceId)
    delete collection.value[spaceId]
  }

  function addSpace(space: ISpaceResponse) {
    collection.value[space.uid] = {
      ...omit(space, ['widgets']),
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
        return updatedWidget
      })

      widgetStore.setSpaceWidgets(space.uid, widgets)
    }

  }

  function createBackup() {
    backupSpaces.value = cloneDeep(collection.value)
    backupWidgets.value = cloneDeep(widgetStore.collection)
  }

  function deleteBackup() {
    backupSpaces.value = {}
    backupWidgets.value = {}
  }

  function resetFromBackup() {
    collection.value = cloneDeep(backupSpaces.value)
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

  async function setDefaultSpace(spaceUid: string | null) {
    updateUser({
      default_space: spaceUid,
    })

    collection.value[defaultSpace.value].is_default = false

    if (spaceUid !== null) {
      collection.value[spaceUid].is_default = true
    }
  }
  return {
    isEditMode,
    setEditMode,
    toggleEditMode,
    collection,
    defaultSpace,
    setDefaultSpace,
    fetchHomepageSpaces,
    homepageSpaces,
    mySpaces,
    myBookmarkedSpaces,
    initSpaces,
    fetchSpace,
    createSpace,
    updateSpace,
    cloneSpace,
    deleteSpace,
    createBackup,
    deleteBackup,
    resetFromBackup,
    toggleBookmark,
  }
})
