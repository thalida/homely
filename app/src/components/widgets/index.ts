import LinkModal from './LinkModal.vue'

export const LINK_WIDGET_KEY = 'link'
export const TEXT_WIDGET_KEY = 'text'

export type TWidgetType = typeof LINK_WIDGET_KEY | typeof TEXT_WIDGET_KEY

export const widgetComponents = {
  [LINK_WIDGET_KEY]: {
    modal: LinkModal,
  },
  [TEXT_WIDGET_KEY]: {
    modal: LinkModal,
  },
}
