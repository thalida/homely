import type { Component } from 'vue'
import LinkWidget from './LinkWidget.vue'
import { EWidgetType } from '@/stores/widget'

export const widgetComponents: Record<EWidgetType, Component | null> = {
  [EWidgetType.LINK]: LinkWidget,
  [EWidgetType.TEXT]: null,
}
