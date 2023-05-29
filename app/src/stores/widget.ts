import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { PartialDeep } from 'type-fest'
import { debounce, merge, omit } from 'lodash'
import type { IWidgets, IWidgetLayout, IWidget } from '@/types/widget';
import { createWidget as createWidgetReq, deleteWidget as deleteWidgetReq, updateWidget as updateWidgetReq } from '@/api/widget';

export const useWidgetStore = defineStore('widget', () => {
  const collection = ref<IWidgets>({})

  const isSaving = ref(false)
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
  const layoutsBySpace = computed({
    get() {
      const res: Record<string, IWidgetLayout[]> = {}
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

          res[spaceId].push(collection.value[widgetId].layout)
        }
      }

      return res
    },
    set() {},
  });

  const gridStackBySpace = computed({
    get() {
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
            locked: true,
            widget: collection.value[widgetId],
            // widget: omit(collection.value[widgetId], ['layout']),
            // content: "widget.content"
            // content: `<component :is="SpaceWidget" :widgetId="${widgetId}"></component>`
          }
          res[spaceId].push(gridStack)
        }
      }

      return res
    },
    set() {},
  });

  function setSpaceWidgets(spaceId: string, widgets: IWidget[]) {
    if (spaces.value.indexOf(spaceId) === -1) {
      spaces.value.push(spaceId)
    }

    for (const widget of widgets) {
      collection.value[widget.uid] = widget
    }
  }

  const maxLayoutPositionBySpace = computed(() => {
    const res: Record<string, { x: number, y: number }> = {}
    for (const spaceId of spaces.value) {
      const widgets = activeWidgetsBySpace.value[spaceId]
      if (!widgets) {
        res[spaceId] = {x: 0, y: 0}
        continue
      }

      let maxX = 0
      let maxY = 0
      for (const widgetId of widgets) {
        if (!collection.value[widgetId]) {
          continue
        }

        if (collection.value[widgetId].state.deleted) {
          continue
        }

        const widget = collection.value[widgetId]
        if (widget.layout.x + widget.layout.w > maxX) {
          maxX = widget.layout.x + widget.layout.w
        }

        if (widget.layout.y + widget.layout.h > maxY) {
          maxY = widget.layout.y + widget.layout.h
        }

        res[spaceId] = { x: maxX, y: maxY }
      }
    }

    return res
  });

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
    newWidget.layout.i = newWidget.uid
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
          layout: omit(widget.layout, ['i']),
        })
        newWidget.layout.i = newWidget.uid
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

      collection.value[widget.uid] = {
        ...widget,
        ...updatedWidget
      }

      collection.value[widget.uid].state.dirty = false
    }

    isSaving.value = false
  }

  const debouncedSaveDirtyWidgets = debounce(saveDirtyWidgets, 500)

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
    layoutsBySpace,
    maxLayoutPositionBySpace,

    setSpaceWidgets,
    unselectAllWidgets,
    selectWidgetById,
    deleteWidgetsBySpace,

    markWidgetAsDirty,
    saveDirtyWidgets,
    debouncedSaveDirtyWidgets,

    updateWidget,
    draftUpdateWidget,
    draftDeleteWidget,
    draftCreateWidget,

    gridStackBySpace,
  }
})
