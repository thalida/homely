import type { Component } from 'vue'
import { EWidgetType } from '@/types/widget'
import LinkWidget from './LinkWidget'
import TextWidget from './TextWidget'
import ImageWidget from './ImageWidget'

export const widgetComponents: Record<EWidgetType, Component | null> = {
  [EWidgetType.LINK]: LinkWidget.component,
  [EWidgetType.TEXT]: TextWidget.component,
  [EWidgetType.IMAGE]: ImageWidget.component,
}

export const widgetMenuItems = [
  LinkWidget.menuItem,
  TextWidget.menuItem,
  ImageWidget.menuItem,
]
