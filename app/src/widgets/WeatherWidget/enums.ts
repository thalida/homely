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

export const unitsHTMLCodeMap: Record<string, string> = {
  [EWeatherWidgetUnits.STANDARD]: '&#8490;', // K
  [EWeatherWidgetUnits.METRIC]: '&#8451;', // C
  [EWeatherWidgetUnits.IMPERIAL]: '&#8457;', // F
}
export const unitsSymbolMap: Record<string, string> = {
  [EWeatherWidgetUnits.STANDARD]: 'K', // K
  [EWeatherWidgetUnits.METRIC]: 'C', // C
  [EWeatherWidgetUnits.IMPERIAL]: 'F', // F
}
