import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue';
import type { Editor } from '@tiptap/vue-3'

export const useEditorsStore = defineStore('editors', () => {
  const editors: Ref<Record<string, Editor>> = ref({})

  function connect(widgetId: string, editor: Editor) {
    editors.value[widgetId] = editor
  }

  function disconnect(widgetId: string) {
    delete editors.value[widgetId]
  }

  return {
    editors,
    connect,
    disconnect,
  };
});
