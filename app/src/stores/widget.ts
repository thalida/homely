import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import type { PartialDeep } from 'type-fest'
import { merge, omit } from 'lodash'
import type { IWidgets, IWidgetLayout, IWidget } from '@/types/widget';
import { useUserStore } from './user';

export const useWidgetStore = defineStore('widget', () => {
  const userStore = useUserStore()
  const collection = ref<IWidgets>({})

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

  function markWidgetAsDraft(uid: string) {
    if (!collection.value[uid]) {
      return;
    }

    collection.value[uid].state.draft = true
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
        temporary: false,
        draft: true,
      },
    }
    newWidget.layout.i = newWidget.uid
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
    const spaceWidgets = allWidgetsBySpace.value[spaceId]

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

      await axios.patch(`http://localhost:8000/api/widgets/${widget.uid}/`, {
        content: widget.content,
        layout: widget.layout,
      }, {
        headers: {
          Authorization: `Bearer ${userStore.accessToken}`,
        },
      })

      collection.value[widget.uid].state.draft = false
    }
  }


  return {
    collection,

    getWidgetById,
    allWidgetsBySpace,
    activeWidgetsBySpace,
    layoutsBySpace,
    setSpaceWidgets,

    unselectAllWidgets,
    selectWidgetById,

    markWidgetAsDraft,
    draftUpdateWidget,
    draftDeleteWidget,
    draftCreateWidget,
    saveDraftWidgets,
  }
})
