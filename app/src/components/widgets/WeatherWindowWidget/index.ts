import { EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./WeatherWindowWidget.vue";

const widget_type = EWidgetType.WEATHER;

const menuItem: IWidgetMenuItem = {
  label: 'Weather Window',
  widget: {
    widget_type,
    content: {
      items: [
        {
          place: null,
          useCurrentLocation: true,
          showNumForecastDays: 5,
          showCity: true,
        },
      ],
    },
    layout: {
      w: 3,
      h: 1,
      isResizable: true,
      preserveAspectRatio: false,
    },
  },
}

export default {
  widget_type,
  component,
  menuItem,
}
