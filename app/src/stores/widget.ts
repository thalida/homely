import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { defineStore } from 'pinia'
import type { PartialDeep } from 'type-fest'
import { merge, cloneDeep, omit } from 'lodash'
import type { IWidgets, IWidgetLayout, IWidget } from '@/types/widget';
import { useUserStore } from './user';
import axios from 'axios'

export const useWidgetStore = defineStore('widget', () => {
  const userStore = useUserStore()
  const collection = ref<IWidgets>({})

  const spaces = ref<string[]>([])
  const getWidgetById = computed(() => (uid: string) => collection.value[uid])
  const widgetsBySpace = computed(() => {
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
  const layoutsBySpace = computed({
    get() {
      const res: Record<string, IWidgetLayout[]> = {}
      for (const spaceId of spaces.value) {
        res[spaceId] = []

        const widgets = widgetsBySpace.value[spaceId]
        if (!widgets) {
          continue
        }

        for (const widgetId of widgets) {
            res[spaceId].push(collection.value[widgetId].layout)
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

  function unselectAllWidgets(spaceId: string) {
    const spaceWidgets = widgetsBySpace.value[spaceId]
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

  function draftCreateWidget(spaceId: string, widgetInput: Omit<IWidget, 'id' | 'state' | 'space'>) {
    const widgetId = `draft-${uuidv4()}`
    const newWidget: IWidget = {
      ...widgetInput,
      uid: widgetId,
      space: spaceId,
      state: {
        deleted: false,
        selected: true,
        temporary: false,
        draft: true,
      },
    }
    collection.value[newWidget.uid] = newWidget;

    return collection.value[newWidget.uid]
  }

  function draftUpdateWidget(uid: string, widget: PartialDeep<IWidget>) {
    if (!collection.value[uid]) {
      return;
    }

    collection.value[uid] = merge(collection.value[uid], widget);
    collection.value[uid].state.draft = true
    return collection.value[uid];
  }

  function draftDeleteWidget(uid: string) {
    if (!collection.value[uid]) {
      return;
    }

    const isNew = uid.startsWith('draft-')
    if (isNew) {
      delete collection.value[uid]
      return;
    }

    collection.value[uid].state.deleted = true
    collection.value[uid].state.draft = true
    collection.value[uid].state.selected = false
  }

  async function saveDraftWidgets(spaceId: string) {
    const spaceWidgets = widgetsBySpace.value[spaceId]
    if (!spaceWidgets) {
      return;
    }

    for (const widgetId of spaceWidgets) {
      const widget = collection.value[widgetId]
      if (!widget || !widget.state.draft) {
        continue
      }

      const isNew = widget.uid.startsWith('draft-')

      if (isNew) {
        const newWidgetRes = await axios.post('http://localhost:8000/api/widgets/', {
          widget_type: widget.widget_type,
          space: widget.space,
          content: widget.content,
          layout: omit(widget.layout, ['i']),
        }, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${userStore.accessToken}`,
          },
        })
        const newWidget = newWidgetRes.data
        newWidget.layout.i = newWidget.uid
        newWidget.state = {
          selected: false,
          draft: false,
          deleted: false,
          temporary: false,
        }

        delete collection.value[widget.uid]
        collection.value[newWidget.uid] = newWidget
        continue
      }

      const isDeleted = widget.state.deleted
      if (isDeleted) {
        await axios.delete(`http://localhost:8000/api/widgets/${widget.uid}/`, {
          headers: {
            Authorization: `Bearer ${userStore.accessToken}`,
          },
        })

        delete collection.value[widget.uid]
        continue
      }

      const updateWidgetRes = await axios.patch(`http://localhost:8000/api/widgets/${widget.uid}/`, {
        content: widget.content,
        layout: widget.layout,
      }, {
        headers: {
          Authorization: `Bearer ${userStore.accessToken}`,
        },
      })

      collection.value[widget.uid] = updateWidgetRes.data
      collection.value[widget.uid].state.draft = false
    }
  }


  return {
    collection,

    getWidgetById,
    widgetsBySpace,
    layoutsBySpace,
    setSpaceWidgets,

    unselectAllWidgets,
    selectWidgetById,

    draftUpdateWidget,
    draftDeleteWidget,
    draftCreateWidget,
    saveDraftWidgets,
  }
})
