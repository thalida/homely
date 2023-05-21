import { EWeatherWidgetStyle, EWeatherWidgetUnits, EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./WeatherWidget.vue";

const widget_type = EWidgetType.WEATHER;

const menuItem: IWidgetMenuItem = {
  label: 'Weather',
  widget: {
    widget_type,
    content: {
      items: [
        {
          style: EWeatherWidgetStyle.CURRENT,
          units: EWeatherWidgetUnits.METRIC,
          location: null,
          useCurrentLocation: true,
          showLocation: true,
          showNumForecastDays: 5,
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
