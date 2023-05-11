import type { Component } from 'vue'
import { EWidgetType } from '@/stores/widget'
import LinkWidget from './LinkWidget'
import TextWidget from './TextWidget'

export const widgetComponents: Record<EWidgetType, Component | null> = {
  [EWidgetType.LINK]: LinkWidget.component,
  [EWidgetType.TEXT]: TextWidget.component,
}

export const widgetMenuItems = [
  LinkWidget.menuItem,
  TextWidget.menuItem,
]
