import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { PartialDeep } from 'type-fest'
import { cloneDeep, debounce, merge, omit } from 'lodash'
import type { IWidgets, IWidget } from '@/types/widget';
import { createWidget as createWidgetReq, deleteWidget as deleteWidgetReq, updateWidget as updateWidgetReq } from '@/api/widget';

export const useWidgetStore = defineStore('widget', () => {
  const collection = ref<IWidgets>({})
  const backupCollectionBySpace: Ref<Record<string, IWidgets>> = ref({})

  const isSaving = ref(false)
  const isEditingBySpace: Ref<Record<string, boolean>> = ref({})
  const spaces = ref<string[]>([])
  const getWidgetById = computed(() => (uid: string) => collection.value[uid])
  const allWidgetsBySpace = computed(() => {
    const bySpace = Object.keys(collection.value).reduce((acc, widgetId) => {
      const widget = collection.value[widgetId]
      if (!acc[widget.space]) {
        acc[widget.space] = []
      }

      acc[widget.space].push(widgetId)
      return acc
    }, {} as Record<string, string[]>);

    return bySpace
  });
  const activeWidgetsBySpace = computed(() => {
    const bySpace = Object.keys(collection.value).reduce((acc, widgetId) => {
      const widget = collection.value[widgetId]
      if (!acc[widget.space]) {
        acc[widget.space] = []
      }

      if (widget.state.deleted) {
        return acc
      }

      acc[widget.space].push(widgetId)
      return acc
    }, {} as Record<string, string[]>);

    return bySpace
  });

  const gridStackBySpace = computed(() => {
    const res: Record<string, any[]> = {}

    for (const spaceId of spaces.value) {
      res[spaceId] = []

      const widgets = activeWidgetsBySpace.value[spaceId]
      if (!widgets) {
        continue
      }

      for (const widgetId of widgets) {
        if (!collection.value[widgetId]) {
          continue
        }

        if (collection.value[widgetId].state.deleted) {
          continue
        }

        const gridStack = {
          x: collection.value[widgetId].layout.x,
          y: collection.value[widgetId].layout.y,
          w: collection.value[widgetId].layout.w,
          h: collection.value[widgetId].layout.h,
          locked: false,
          id: widgetId,
        }
        res[spaceId].push(gridStack)
      }
    }

    return res
  });


  function setIsEditing(spaceId: string, isEditing: boolean) {
    isEditingBySpace.value[spaceId] = isEditing
  }


  function createWidgetsBackup(spaceId: string) {
    const widgets = allWidgetsBySpace.value[spaceId];

    if (typeof widgets === 'undefined') {
      return
    }

    backupCollectionBySpace.value[spaceId] = {}
    for (const widgetId of widgets) {
      backupCollectionBySpace.value[spaceId][widgetId] = collection.value[widgetId]
    }
  }

  function deleteWidgetsBackup(spaceId: string) {
    delete backupCollectionBySpace.value[spaceId]
  }

  function resetWidgetsFromBackup(spaceId: string) {
    const currrent = allWidgetsBySpace.value[spaceId]
    const backup = backupCollectionBySpace.value[spaceId]

    for (const widgetId of currrent) {
      if (typeof backup === 'undefined' || backup === null || typeof backup[widgetId] === 'undefined' || backup[widgetId] === null) {
        delete collection.value[widgetId]
        continue
      }

      collection.value[widgetId] = cloneDeep(backup[widgetId])
    }

    deleteWidgetsBackup(spaceId)
  }

  function setSpaceWidgets(spaceId: string, widgets: IWidget[]) {
    if (spaces.value.indexOf(spaceId) === -1) {
      spaces.value.push(spaceId)
    }

    for (const widget of widgets) {
      collection.value[widget.uid] = widget
    }
  }

  function unselectAllWidgets(spaceId: string) {
    const spaceWidgets = allWidgetsBySpace.value[spaceId]
    if (!spaceWidgets) {
      return;
    }

    for (const widgetId of spaceWidgets) {
      collection.value[widgetId].state.selected = false
    }
  }

  function selectWidgetById(uid: string) {
    if (!collection.value[uid]) {
      return;
    }

    collection.value[uid].state.selected = true
  }

  function unselectWidgetById(uid: string) {
    if (!collection.value[uid]) {
      return;
    }

    collection.value[uid].state.selected = false
  }

  function markWidgetAsDirty(uid: string) {
    if (!collection.value[uid]) {
      return;
    }

    collection.value[uid].state.dirty = true
  }

  function draftCreateWidget(spaceId: string, widgetInput: Omit<IWidget, 'uid' | 'state' | 'space'>) {
    const widgetId = `draft-${uuidv4()}`
    const newWidget: IWidget = {
      ...widgetInput,
      uid: widgetId,
      space: spaceId,
      state: {
        deleted: false,
        selected: true,
        dirty: true,
        new: true,
      },
    }
    collection.value[newWidget.uid] = newWidget;

    return collection.value[newWidget.uid]
  }

  function updateWidget(uid: string, widget: PartialDeep<IWidget>) {
    if (!collection.value[uid]) {
      return;
    }

    collection.value[uid] = merge(collection.value[uid], widget);
    return collection.value[uid];
  }

  function draftUpdateWidget(uid: string, widget: PartialDeep<IWidget>) {
    if (!collection.value[uid]) {
      return;
    }

    collection.value[uid] = merge(collection.value[uid], widget);
    collection.value[uid].state.dirty = true
    return collection.value[uid];
  }

  function draftDeleteWidget(uid: string) {
    if (!collection.value[uid]) {
      return;
    }

    if (collection.value[uid].state.new) {
      delete collection.value[uid]
      return;
    }

    collection.value[uid].state.deleted = true
    collection.value[uid].state.dirty = true
    collection.value[uid].state.selected = false
  }

  async function saveDirtyWidgets(spaceId: string) {
    const spaceWidgets = allWidgetsBySpace.value[spaceId]

    if (!spaceWidgets) {
      return;
    }

    isSaving.value = true

    for (const widgetId of spaceWidgets) {
      const widget = collection.value[widgetId]


      if (!widget || !widget.state.dirty) {
        continue
      }

      if (widget.state.new) {
        const newWidget = await createWidgetReq({
          ...omit(widget, ['state', 'uid']),
          layout: widget.layout,
        })
        newWidget.state = {
          new: false,
          selected: false,
          dirty: false,
          deleted: false,
        }

        delete collection.value[widget.uid]
        collection.value[newWidget.uid] = newWidget
        continue
      }

      if (widget.state.deleted) {
        await deleteWidgetReq(widget.uid)
        delete collection.value[widget.uid]
        continue
      }


      const updatedWidget = await updateWidgetReq(widget.uid, {
        ...omit(widget, ['state']),
      });

      collection.value[widget.uid].state.dirty = false
      collection.value[widget.uid] = {
        ...widget,
        ...updatedWidget
      }
    }

    isSaving.value = false
  }

  const debouncedSaveDirtyWidgets = debounce(saveDirtyWidgets, 500)

  function discardDirtyWidgets(spaceId: string) {
    resetWidgetsFromBackup(spaceId)
  }

  function startEditMode(spaceId: string) {
    createWidgetsBackup(spaceId)
    setIsEditing(spaceId, true)
  }

  function stopEditMode(spaceId: string) {
    unselectAllWidgets(spaceId)
    deleteWidgetsBackup(spaceId)
    setIsEditing(spaceId, false)
  }

  function saveAndStopEditMode(spaceId: string) {
    saveDirtyWidgets(spaceId)
    stopEditMode(spaceId)
  }

  function discardAndStopEditMode(spaceId: string) {
    discardDirtyWidgets(spaceId)
    stopEditMode(spaceId)
  }

  function deleteWidgetsBySpace(spaceId: string) {
    const spaceWidgets = allWidgetsBySpace.value[spaceId]

    if (!spaceWidgets) {
      return;
    }

    for (const widgetId of spaceWidgets) {
      collection.value[widgetId].state.deleted = true
    }

    debouncedSaveDirtyWidgets(spaceId)
  }

  return {
    collection,

    getWidgetById,
    allWidgetsBySpace,
    activeWidgetsBySpace,

    setSpaceWidgets,
    unselectAllWidgets,
    selectWidgetById,
    unselectWidgetById,

    isEditingBySpace,
    setIsEditing,

    startEditMode,
    stopEditMode,

    createWidgetsBackup,
    deleteWidgetsBackup,
    resetWidgetsFromBackup,

    markWidgetAsDirty,
    saveDirtyWidgets,
    discardDirtyWidgets,
    debouncedSaveDirtyWidgets,

    saveAndStopEditMode,
    discardAndStopEditMode,

    updateWidget,
    draftUpdateWidget,
    draftDeleteWidget,
    draftCreateWidget,

    deleteWidgetsBySpace,

    gridStackBySpace,
  }
})
