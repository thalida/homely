export enum EWidgetType {
  TEXT = 1,
  LINK = 10,
  IMAGE = 20,
  DATETIME = 30,
  WEATHER = 40,
}

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
}

export interface IWidgetState {
  temporary: boolean,
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
  static?: boolean
  preserveAspectRatio?: boolean
  isResizable?: boolean
}

export interface IWidgetMenuItem {
  label: string
  widget: IWidgetButton
}

export interface IWidgetButton {
  widget_type: EWidgetType
  content: Record<string, any>
  layout: Pick<IWidgetLayout, 'w' | 'h' | 'isResizable' | 'preserveAspectRatio'>
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
    datetimes: IDateTime[]
  }
}

export interface IDateTime {
  timezone: string | null
  useLocalTime: boolean
  formatLine1: string
  formatLine2: string
  showCity: boolean
  showLine1: boolean
  showLine2: boolean
  showDynamicIcon: boolean
  showDynamicBackground: boolean
  showIsLocalTimeLabel: boolean
}


export interface IWeatherWidget extends IWidget {
  content: {
    items: IWeatherItem[]
  }
}

export interface IWeatherItem {
  place: IWeatherPlace | null,
  currently: Record<string, any> | null
  forecast: Record<string, any>[] | null
  useCurrentLocation: boolean,
  units: EWeatherWidgetUnits,
  fetchedOn: number | null,
  style: EWeatherWidgetStyle,
  showNumForecastDays: number,
}


export enum EWeatherWidgetStyle {
  CURRENT = 'current',
  FORECAST = 'forecast',
}

export enum EWeatherWidgetUnits {
  IMPERIAL = 'imperial',
  METRIC = 'metric',
  STANDARD = 'standard',
}

export interface IWeatherPlace {
  name: string
  lat: number
  lng: number
}

export interface IWeatherByLocation {
  [key: string]: IWeather
}
export interface IWeather {
  currently: Record<string, any>
  forecast: Record<string, any>[]
}

export interface ILinkWidget extends IWidget {
  content: {
    url: string | null,
    metadata: Record<string, any>,
    style: ELinkWidgetStyle,
    useCustomIcon: boolean,
    icon: string | null,
    showImage: boolean,
    showUrl: boolean,
    showTitle: boolean,
    showDescription: boolean,
  }
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
