import type { ILocation } from "@/types/location";
import type { IBaseWidget, IWidget } from "@/types/widget";

export interface IBaseDateTimeWidget extends IBaseWidget {
  content: {
    items: IDateTime[]
  }
}

export type TDateTimeWidget = IBaseDateTimeWidget & IWidget;

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
