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
    card_style: {
      backgroundColor: 'transparent',
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
  widget_type,
  component,
  menuItem,
}
