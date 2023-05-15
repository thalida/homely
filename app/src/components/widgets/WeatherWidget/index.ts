import { EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./WeatherWidget.vue";

const widgetType = EWidgetType.WEATHER;

const menuItem: IWidgetMenuItem = {
  label: 'Weather',
  widgetType,
  buttons: [
    {
      widgetType,
      content: {
        location: null,
        weather: null,
        useCurrentLocation: true,
      },
      style: {
        id: "weather",
        label: "Weather",
        layout: {
          w: 2,
          h: 1,
          isResizable: true,
          preserveAspectRatio: false,
        },
      },
    },
  ],
}

export default {
  widgetType,
  component,
  menuItem,
}
