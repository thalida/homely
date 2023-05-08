import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useWidgetStore } from './widget'

export const useSpaceStore = defineStore('space', () => {
  const widgets = useWidgetStore()

  const isEditMode = ref(false)
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
