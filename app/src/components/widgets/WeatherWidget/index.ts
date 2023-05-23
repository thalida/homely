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
  windLottie,
} from './weatherLottie';

import { cloudMoonHeavyrainSvg, cloudMoonRainSvg, cloudMoonSnowSvg, cloudMoonSvg, cloudSunHeavyrainSvg, cloudSunRainSvg, cloudSunSnowSvg, cloudSunSvg, cloudSvg, cloudThunderHeavyrainSvg, moonSvg, sunSvg } from "./weather3dSvgs";
import { ClearNightSvg, DrizzleSvg, FogSvg, MixRainfallSvg, MostlyCloudySvg, MostlySunnySvg, PartlyCloudyNightSvg, PartlyCloudySvg, RainSvg, SmokeSvg, SnowSvg } from "./weatherSvgs";
import { CloudsSunSunnyWeatherSvg, CloudyWeatherCloudsCloudSvg, FoggyWeatherFogCloudsCloudySvg, MoonWeatherCloudsCloudySvg, RainCloudDrizzelWeatherSvg, RainStormShowerWeatherSvg, StormWeatherNightCloudsSvg, WeatherNightMoonMoonlightSvg, WeatherSunSunnyTemperatureSvg, WinterSnowCloudsWeatherSvg } from "./weatherSvgs2";

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
          showTemperature: true,
          showUnits: false,
          showIcon: true,
          showDescription: true,
          showTime: true,
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

// https://ui8.net/msakta/products/weather-animated-icons
export const weatherUI83dLottieMap: Record<string, any> = {
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
  "50d": windLottie,
  "50n": windLottie,
}

// https://ui8.net/msakta/products/weather-animated-icons
export const weatherUI83dSvgMap: Record<string, any> = {
  "01d": sunSvg,
  "01n": moonSvg,
  "02d": cloudSunSvg,
  "02n": cloudMoonSvg,
  "03d": cloudSvg,
  "03n": cloudSvg,
  "04d": cloudSvg,
  "04n": cloudSvg,
  "09d": cloudSunRainSvg,
  "09n": cloudMoonRainSvg,
  "10d": cloudSunHeavyrainSvg,
  "10n": cloudMoonHeavyrainSvg,
  "11d": cloudThunderHeavyrainSvg,
  "11n": cloudThunderHeavyrainSvg,
  "13d": cloudSunSnowSvg,
  "13n": cloudMoonSnowSvg,
  "50d": null,
  "50n": null,
}

// https://ui8.net/likeapples/products/weather-icons-set
export const weatherUI8LikeApplesSvgMap: Record<string, any> = {
  "01d": MostlySunnySvg,
  "01n": ClearNightSvg,
  "02d": PartlyCloudySvg,
  "02n": PartlyCloudyNightSvg,
  "03d": MostlyCloudySvg,
  "03n": MostlyCloudySvg,
  "04d": SmokeSvg,
  "04n": SmokeSvg,
  "09d": DrizzleSvg,
  "09n": DrizzleSvg,
  "10d": RainSvg,
  "10n": RainSvg,
  "11d": MixRainfallSvg,
  "11n": MixRainfallSvg,
  "13d": SnowSvg,
  "13n": SnowSvg,
  "50d": FogSvg,
  "50n": FogSvg,
}

// https://www.iconfinder.com/iconsets/weather-color-2
export const weatherColor2SvgMap: Record<string, any> = {
  "01d": WeatherSunSunnyTemperatureSvg,
  "01n": WeatherNightMoonMoonlightSvg,
  "02d": CloudsSunSunnyWeatherSvg,
  "02n": MoonWeatherCloudsCloudySvg,
  "03d": CloudyWeatherCloudsCloudSvg,
  "03n": CloudyWeatherCloudsCloudSvg,
  "04d": CloudyWeatherCloudsCloudSvg,
  "04n": CloudyWeatherCloudsCloudSvg,
  "09d": RainCloudDrizzelWeatherSvg,
  "09n": RainCloudDrizzelWeatherSvg,
  "10d": RainStormShowerWeatherSvg,
  "10n": RainStormShowerWeatherSvg,
  "11d": StormWeatherNightCloudsSvg,
  "11n": StormWeatherNightCloudsSvg,
  "13d": WinterSnowCloudsWeatherSvg,
  "13n": WinterSnowCloudsWeatherSvg,
  "50d": FoggyWeatherFogCloudsCloudySvg,
  "50n": FoggyWeatherFogCloudsCloudySvg,
}

// https://lucide.dev/
export const weatherLucideIconMap: Record<string, any> = {
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

export const defaultWeatherSvgMap = weatherColor2SvgMap;
export const defaultLottieMap = weatherUI83dLottieMap;

export const unitsHTMLCodeMap: Record<string, string> = {
  [EWeatherWidgetUnits.STANDARD]: '&#8490;', // K
  [EWeatherWidgetUnits.METRIC]: '&#8451;', // C
  [EWeatherWidgetUnits.IMPERIAL]: '&#8457;', // F
}
export const unitsSymbolMap: Record<string, string> = {
  [EWeatherWidgetUnits.STANDARD]: 'K', // K
  [EWeatherWidgetUnits.METRIC]: 'C', // C
  [EWeatherWidgetUnits.IMPERIAL]: 'F', // F
}

export default {
  widget_type,
  component,
  menuItem,
}
