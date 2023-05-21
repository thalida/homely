import { EWeatherWidgetStyle, EWeatherWidgetUnits, EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./WeatherWidget.vue";
import {
  SunIcon,
  MoonIcon,
  CloudSunIcon,
  CloudMoonIcon,
  CloudIcon,
  CloudyIcon,
  CloudSunRainIcon,
  CloudMoonRainIcon,
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSnowIcon
} from 'lucide-vue-next';

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
    card_style: {
      backgroundColor: null,
    },
    layout: {
      w: 3,
      h: 1,
      isResizable: true,
      preserveAspectRatio: false,
    },
  },
}

export const weatherIconMap = {
  "01d": SunIcon,
  "01n": MoonIcon,
  "02d": CloudSunIcon,
  "02n": CloudMoonIcon,
  "03d": CloudIcon,
  "03n": CloudIcon,
  "04d": CloudyIcon,
  "04n": CloudyIcon,
  "09d": CloudSunRainIcon,
  "09n": CloudMoonRainIcon,
  "10d": CloudRainIcon,
  "10n": CloudRainIcon,
  "11d": CloudLightningIcon,
  "11n": CloudLightningIcon,
  "13d": CloudSnowIcon,
  "13n": CloudSnowIcon,
  "50d": CloudFogIcon,
  "50n": CloudFogIcon,
}

export default {
  widget_type,
  component,
  menuItem,
}
