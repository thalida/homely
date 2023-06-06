import { EWidgetType } from "@/constants/widget";
import type { IWidgetDefinition } from "@/types/widget";
import WeatherCard from "./WeatherCard.vue";
import WeatherAddBtn from "./WeatherAddBtn.vue";
import WeatherMenuSettings from "./WeatherMenuSettings.vue";


const widgetDefintion: IWidgetDefinition = {
  widgetType: EWidgetType.WEATHER,
  cardComponent: WeatherCard,
  menuAddBtnComponent: WeatherAddBtn,
  menuSettingsComponent: WeatherMenuSettings,
}

export default widgetDefintion;
