import { EWidgetType } from "@/constants/widget";
import type { IWidgetDefinition } from "@/types/widget";
import DateTimeCard from "./DateTimeCard.vue";
import DateTimeMenuBtn from "./DateTimeMenuBtn.vue";
import DateTimeMenuSettings from "./DateTimeMenuSettings.vue";

const widgetDefintion: IWidgetDefinition = {
  widgetType: EWidgetType.DATETIME,
  cardComponent: DateTimeCard,
  menuBtnComponent: DateTimeMenuBtn,
  menuSettingsComponent: DateTimeMenuSettings,
}

export default widgetDefintion;
