import type { Component } from 'vue'
import LinkWidget from './LinkWidget.vue'

export const LINK_WIDGET_KEY = 'link'
export const TEXT_WIDGET_KEY = 'text'

export type TWidgetType = typeof LINK_WIDGET_KEY | typeof TEXT_WIDGET_KEY

export const widgetComponents: Record<TWidgetType, Component | null> = {
  [LINK_WIDGET_KEY]: LinkWidget,
  [TEXT_WIDGET_KEY]: null,
}
