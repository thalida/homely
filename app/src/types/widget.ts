export enum EWidgetType {
  LINK = 'link',
  TEXT = 'text',
}

export interface IWidget {
  id: string
  type: EWidgetType
  content: Record<string, any>
  state: IWidgetState
  style: IWidgetStyle
}

export interface IWidgetState {
  selected: boolean,
  temporary: boolean,
}

export interface IWidgetStyle {
  id: string
  label: string
  layout: Omit<IWidgetLayout, 'i' | 'x' | 'y'>
}

export interface IWidgets {
  [key: string]: IWidget
}

export interface IWidgetLayout {
  i: string
  x: number
  y: number
  w: number
  h: number
  static?: boolean
  preserveAspectRatio?: boolean
  isResizable?: boolean
}

export interface IWidgetButton extends Pick<IWidget, 'type' | 'content' | 'style'> { }

export interface ITextWidget extends IWidget {
  content: ITextWidgetContent
}

export interface ITextWidgetContent {
  text: string
  styles: ITextWidgetStyles
}

export interface ITextWidgetStyles {
  fontFamily: string
  fontVariant: string
  fontSize: number
  textAlign: string
}
