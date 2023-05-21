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

import {
  sunLottie,
  moonLottie,
  cloudSunLottie,
  cloudMoonLottie,
  cloudLottie,
  cloudSunRainLottie,
  cloudMoonRainLottie,
  cloudSunHeavyrainLottie,
  cloudMoonHeavyrainLottie,
  cloudThunderHeavyrainLottie,
  cloudSunSnowLottie,
  cloudMoonSnowLottie,
} from './weatherLottie';

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

export const weatherLottieMap: Record<string, any> = {
  "01d": sunLottie,
  "01n": moonLottie,
  "02d": cloudSunLottie,
  "02n": cloudMoonLottie,
  "03d": cloudLottie,
  "03n": cloudLottie,
  "04d": cloudLottie,
  "04n": cloudLottie,
  "09d": cloudSunRainLottie,
  "09n": cloudMoonRainLottie,
  "10d": cloudSunHeavyrainLottie,
  "10n": cloudMoonHeavyrainLottie,
  "11d": cloudThunderHeavyrainLottie,
  "11n": cloudThunderHeavyrainLottie,
  "13d": cloudSunSnowLottie,
  "13n": cloudMoonSnowLottie,
  "50d": null,
  "50n": null,
}
export default {
  widget_type,
  component,
  menuItem,
}
