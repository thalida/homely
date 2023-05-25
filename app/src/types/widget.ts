import type { UseToNumberOptions } from '@vueuse/core'
import type { ILocation } from './location'
import type { Component } from 'vue'

export enum EWidgetType {
  TEXT = 1,
  LINK = 10,
  IMAGE = 20,
  DATETIME = 30,
  WEATHER = 40,
}

export enum EWidgetColorNames {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
  PURPLE = 'purple',
  PINK = 'pink',
  WHITE = 'white',
  GRAY = 'gray',
  BLACK = 'black',
  DYNAMIC = 'dynamic',
  TRANSPARENT = 'transparent',
}

export const DEFAULT_WIDGET_COLOR = EWidgetColorNames.DYNAMIC

export interface IWidgetDefinition {
  widgetType: EWidgetType
  cardComponent: Component
  menuBtnComponent: Component
  menuSettingsComponent: Component
}

export interface IWidgets {
  [key: string]: IWidget
}

export interface IWidget extends IBaseWidget {
  uid: string
  space: string,
  state: IWidgetState
  layout: IWidgetLayout,
}

export interface IBaseWidget {
  widget_type: EWidgetType
  layout: IBaseWidgetLayout,
  content: Record<string, any>
  card_style: IWidgetCardStyle,
  link?: string | null,
}

export interface IWidgetCardStyle {
  background_color: EWidgetColorNames,
}

export interface IWidgetState {
  selected: boolean,
  deleted: boolean,
  dirty: boolean,
  new: boolean,
}

export interface IWidgetLayout extends IBaseWidgetLayout {
  i: string
  x: number
  y: UseToNumberOptions
}

export interface IBaseWidgetLayout {
  w: number
  h: number
  preserveAspectRatio?: boolean
  isResizable?: boolean
}

export interface IWidgetMenuItem {
  label: string
  widget: IWidgetButton
}

export interface IWidgetButton extends Omit<IWidget, 'uid' | 'space' | 'state' | 'layout'> {
  layout: Omit<IWidgetLayout, 'i' | 'x' | 'y'>
}
