import { EWidgetType, type IWidgetMenuItem } from "@/types/widget";
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
    },
    style: {
      name: 'default',
      layout: {
        w: 2,
        h: 1,
        isResizable: true,
        preserveAspectRatio: false,
      },
    },
  },
}

export default {
  widgetType,
  component,
  menuItem,
}
