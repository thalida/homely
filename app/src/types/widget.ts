export enum EWidgetType {
  LINK = 'link',
  TEXT = 'text',
  IMAGE = 'image',
  DATETIME = 'datetime',
  WEATHER = 'weather',
}

export interface IWidget {
  id: string
  widgetType: EWidgetType
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

export interface IWidgetMenuItem {
  widgetType: EWidgetType
  label: string
  buttons: IWidgetButton[]
}

export interface IWidgetButton extends Pick<IWidget, 'widgetType' | 'content' | 'style'> { }

export interface ITextWidget extends IWidget {
  content: {
    text: string
    isInteractive: boolean
    styles: {
      fontFamily: string
      fontVariant: string
      fontSize: number
      textAlign: string
    }
  }
}

export interface IDateTimeWidget extends IWidget {
  content: {
    datetimes: IDateTime[]
  }
}

export interface IDateTime {
  format: string
  timezone: string | null
  useLocalTime: boolean
}


export interface IWeatherWidget extends IWidget {
  content: {
    location: IWeatherLocation,
    weather: any,
    useCurrentLocation: boolean,
  }
}

export interface IWeatherLocation {
  name: string
  lat: number
  lng: number
}
