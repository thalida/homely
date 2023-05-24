import type { ILocation } from './location'

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

export interface IWidgets {
  [key: string]: IWidget
}

export interface IWidget {
  uid: string
  widget_type: EWidgetType
  content: Record<string, any>
  state: IWidgetState
  layout: IWidgetLayout,
  space: string,
  card_style: {
    background_color: EWidgetColorNames,
  },
  link?: string | null,
}

export interface IWidgetState {
  selected: boolean,
  deleted: boolean,
  dirty: boolean,
  new: boolean,
}

export interface IWidgetLayout {
  i: string
  x: number
  y: number
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

export interface ITextWidget extends IWidget {
  content: {
    text: string
    isInteractive: boolean
    fontFamily: string
    fontVariant: string
    fontSize: number
    textAlign: string
    lineHeight: number
  }
}

export interface IDateTimeWidget extends IWidget {
  content: {
    items: IDateTime[]
  }
}

export interface IDateTime {
  useCurrentLocation: boolean
  location: ILocation | null
  timezone: string | null
  formatLine1: string
  formatLine2: string
  showLocation: boolean
  showLine1: boolean
  showLine2: boolean
  showDynamicIcon: boolean
  showDynamicBackground: boolean
}


export interface IWeatherWidget extends IWidget {
  content: {
    items: IWeatherWidgetItem[]
  }
}

export interface IWeatherWidgetItem {
  style: EWeatherWidgetStyle,
  units: EWeatherWidgetUnits,
  useCurrentLocation: boolean,
  location: ILocation | null,
  showNumForecastDays: number,
  showLocation: boolean,
  showTemperature: boolean,
  showUnits: boolean,
  showIcon: boolean,
  showDescription: boolean,
  showTime: boolean,
}

export enum EWeatherWidgetStyle {
  CURRENT = 'current',
  FORECAST = 'forecast',
  WINDOW = 'window',
}

export enum EWeatherWidgetUnits {
  IMPERIAL = 'imperial',
  METRIC = 'metric',
  STANDARD = 'standard',
}

export interface IWeatherByLocation {
  [key: string]: IWeather
}
export interface IWeather {
  timezone: string
  currently: Record<string, any>
  forecast: Record<string, any>[]
  fetchedOn: number
  fetchedWith: {
    units: EWeatherWidgetUnits,
    location: ILocation,
  }
}

export interface ILinkWidget extends IWidget {
  content: {
    url: string | null,
    metadata: Record<string, any>,
    style: ELinkWidgetStyle,
    showIcon: boolean,
    showImage: boolean,
    showUrl: boolean,
    showTitle: boolean,
    showDescription: boolean,
    showCustomMetadata: boolean,
  },
  link: string | null,
  original_link: ILink | null,
}

export interface ILink {
  uid: string,
  url: string,
  metadata: Record<string, any>,
}

export enum ELinkWidgetStyle {
  ICON = 'icon',
  FLAG = 'flag',
  CARD = 'card',
}

export interface IImageWidget extends IWidget {
  content: {
    url: string | null,
    backgroundSize: EImageWidgetBackgroundSize,
    backgroundPosition: string,
    backgroundRepeat: string,
  }
}

export enum EImageWidgetBackgroundSize {
  COVER = 'cover',
  CONTAIN = 'contain',
  AUTO = 'auto',
}

export enum EImageWidgetBackgroundPosition {
  CENTER = 'center',
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  LEFT_TOP = 'left-top',
  LEFT_BOTTOM = 'left-bottom',
  RIGHT_TOP = 'right-top',
  RIGHT_BOTTOM = 'right-bottom',
}

export enum EImageWidgetBackgroundRepeat {
  REPEAT = 'repeat',
  REPEAT_X = 'repeat-x',
  REPEAT_Y = 'repeat-y',
  NO_REPEAT = 'no-repeat',
}
