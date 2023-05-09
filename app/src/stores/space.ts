import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useWidgetStore } from './widget'

export const useSpaceStore = defineStore('space', () => {
  const widgets = useWidgetStore()

  const isEditMode: Ref<boolean> = useLocalStorage('homely/space/isEditMode', false)

  function toggleEditMode() {
    isEditMode.value = !isEditMode.value
  }

  function setEditMode(value: boolean) {
    isEditMode.value = value
  }


  return {
    widgets,

    isEditMode,
    setEditMode,
    toggleEditMode,
  }
})
