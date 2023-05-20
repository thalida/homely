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

export const widgetComponents: Record<EWidgetType, Component | null> = supportedWidgets.reduce((acc, widget) => {
  acc[widget.widget_type] = widget.component
  return acc
}, {} as Record<EWidgetType, Component>)

export const widgetMenuItems = supportedWidgets.map((widget) => widget.menuItem)
