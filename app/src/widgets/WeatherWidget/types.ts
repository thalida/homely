import type { ILocation } from "@/types/location";
import type { IBaseWidget, IWidget } from "@/types/widget";
import type { EWeatherWidgetStyle, EWeatherWidgetUnits } from "./enums";

export interface IBaseWeatherWidget extends IBaseWidget {
  content: {
    items: IWeatherWidgetItem[]
  }
}

export type TWeatherWidget = IBaseWeatherWidget & IWidget;

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
