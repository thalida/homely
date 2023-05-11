import type { Component } from 'vue'
import { EWidgetType } from '@/stores/widget'
import LinkWidget from './LinkWidget'

export const widgetComponents: Record<EWidgetType, Component | null> = {
  [EWidgetType.LINK]: LinkWidget.component,
  [EWidgetType.TEXT]: null,
}

export const widgetMenuItems = [
  LinkWidget.menuItem,
]
