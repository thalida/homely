import { EWeatherWidgetUnits, EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./WeatherWindowWidget.vue";

const widget_type = EWidgetType.WEATHER_WINDOW;

const menuItem: IWidgetMenuItem = {
  label: 'Weather Window',
  widget: {
    widget_type,
    content: {
      items: [
        {
          location: null,
          useCurrentLocation: true,
          units: EWeatherWidgetUnits.METRIC,
        },
      ],
    },
    layout: {
      w: 3,
      h: 4,
      isResizable: true,
      preserveAspectRatio: true,
    },
  },
}

export default {
  widget_type,
  component,
  menuItem,
}
