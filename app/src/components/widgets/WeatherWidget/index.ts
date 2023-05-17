import { EWeatherWidgetUnits, EWidgetType, type IWidgetMenuItem } from "@/types/widget";
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
          useCurrentLocation: true,
          units: EWeatherWidgetUnits.METRIC,
          fetchedOn: null,
        },
      ],
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
