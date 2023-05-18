import { EWeatherWidgetStyle, EWeatherWidgetUnits, EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./WeatherWidget.vue";

const widgetType = EWidgetType.WEATHER;

const menuItem: IWidgetMenuItem = {
  label: 'Weather',
  widget: {
    widgetType,
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
  widgetType,
  component,
  menuItem,
}
