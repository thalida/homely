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
          place: null,
          currently: null,
          forecast: null,
          useCurrentLocation: true,
          units: EWeatherWidgetUnits.METRIC,
          fetchedOn: null,
          style: EWeatherWidgetStyle.CURRENT,
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
