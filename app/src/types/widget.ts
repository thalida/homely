import type { EWidgetColorNames, EWidgetType } from '@/enums/widget'
import type { Component } from 'vue'

export interface IWidgetDefinition {
  widgetType: EWidgetType
  cardComponent: Component
  menuBtnComponent: Component
  menuSettingsComponent: Component
}

export interface IWidgets {
  [key: string]: IWidget
}

export interface IBaseWidget {
  widget_type: EWidgetType
  layout: IBaseWidgetLayout,
  content: Record<string, any>
  card_style: {
    background_color: EWidgetColorNames,
  },
  link?: string | null,
}

export interface IBaseWidgetLayout {
  w: number
  h: number
  preserveAspectRatio?: boolean
  isResizable?: boolean
}

export interface IWidget extends IBaseWidget {
  uid: string
  space: string,
  state: {
    selected: boolean,
    deleted: boolean,
    dirty: boolean,
    new: boolean,
  }
  layout: IWidgetLayout,
}

export interface IWidgetLayout extends IBaseWidgetLayout {
  x: number
  y: number
}
