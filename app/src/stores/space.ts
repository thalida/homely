import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { filter, omit, sortBy } from 'lodash'
import { useWidgetStore } from '@/stores/widget'
import { useUserStore } from '@/stores/user'
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
  const homepageSpaces = ref<ISpace[]>([])
  const defaultSpace = computed(() => {
    const foundDefault = Object.values(collection.value).find((space) => space.is_default)
    return foundDefault ? foundDefault.uid : Object.keys(collection.value)[0]
  });
  const isEditing: Ref<Record<string, boolean>> = ref({})

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

  async function toggleBookmark(spaceId: string) {
    const user = userStore.user
    if (!user) {
      return
    }

    await toggleSpaceBookmark(spaceId)
  }

  async function setDefaultSpace(spaceId: string | null) {
    updateUser({
      default_space: spaceId,
    })

    collection.value[defaultSpace.value].is_default = false

    if (spaceId !== null) {
      collection.value[spaceId].is_default = true
    }
  }

  function setIsEditing(spaceId: string, value: boolean) {
    isEditing.value[spaceId] = value
  }

  return {
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
    toggleBookmark,

    isEditing,
    setIsEditing,
  }
})
