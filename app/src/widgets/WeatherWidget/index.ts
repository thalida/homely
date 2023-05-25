import { EWidgetType, type IWidgetDefinition } from "@/types/widget";
import WeatherCard from "./WeatherCard.vue";
import WeatherMenuBtn from "./WeatherMenuBtn.vue";
import WeatherMenuSettings from "./WeatherMenuSettings.vue";


const widgetDefintion: IWidgetDefinition = {
  widgetType: EWidgetType.WEATHER,
  cardComponent: WeatherCard,
  menuBtnComponent: WeatherMenuBtn,
  menuSettingsComponent: WeatherMenuSettings,
}

export default widgetDefintion;
