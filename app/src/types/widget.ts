export enum EWidgetType {
  LINK = 'link',
  TEXT = 'text',
  IMAGE = 'image',
  DATETIME = 'datetime',
  WEATHER = 'weather',
}

export interface IWidgets {
  [key: string]: IWidget
}

export interface IWidget {
  id: string
  widgetType: EWidgetType
  content: Record<string, any>
  state: IWidgetState
  layout: Omit<IWidgetLayout, 'i' | 'x' | 'y'>
}

export interface IWidgetState {
  selected: boolean,
  temporary: boolean,
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

export interface IWidgetButton extends Pick<IWidget, 'widgetType' | 'content' | 'layout'> { }

export interface ITextWidget extends IWidget {
  content: {
    text: string
    isInteractive: boolean
    fontFamily: string
    fontVariant: string
    fontSize: number
    textAlign: string
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
    weatherForcecast: any,
    useCurrentLocation: boolean,
    units: EWeatherWidgetUnits,
  }
}

export enum EWeatherWidgetUnits {
  IMPERIAL = 'imperial',
  METRIC = 'metric',
  STANDARD = 'standard',
}

export interface IWeatherLocation {
  name: string
  lat: number
  lng: number
}

export interface ILinkWidget extends IWidget {
  content: {
    url: string | null,
    metadata: Record<string, any>,
    icon: string | null,
    useCustomIcon: boolean,
  }
}

export enum ELinkWidgetStyle {
  SQUARE = 'SQUARE',
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
