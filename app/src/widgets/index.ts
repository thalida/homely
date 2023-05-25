import type { Component } from 'vue'
import type { EWidgetType } from '@/types/widget'
import LinkWidget from './LinkWidget'
import TextWidget from './TextWidget'
import ImageWidget from './ImageWidget'
import DateTimeWidget from './DateTimeWidget'
import WeatherWidget from './WeatherWidget'

const supportedWidgets = [
  LinkWidget,
  TextWidget,
  ImageWidget,
  DateTimeWidget,
  WeatherWidget,
]

export const cardComponentsByType: Record<EWidgetType, Component> = supportedWidgets.reduce((acc, widget) => {
  acc[widget.widgetType] = widget.cardComponent
  return acc
}, {} as Record<EWidgetType, Component>)

export const widgetMenuBtnComponents = supportedWidgets.map((widget) => widget.menuBtnComponent)
