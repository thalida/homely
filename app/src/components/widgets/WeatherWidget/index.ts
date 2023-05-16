import { EWeatherWidgetUnits, EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./WeatherWidget.vue";

const widgetType = EWidgetType.WEATHER;

const menuItem: IWidgetMenuItem = {
  label: 'Weather',
  widget: {
    widgetType,
    content: {
      location: null,
      weather: null,
      useCurrentLocation: true,
      units: EWeatherWidgetUnits.METRIC,
    },
    layout: {
      w: 3,
      h: 3,
      isResizable: true,
      preserveAspectRatio: false,
    },
  },
}

export default {
  widgetType,
  component,
  menuItem,
}
