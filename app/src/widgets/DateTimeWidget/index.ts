import { EWidgetType } from "@/constants/widget";
import type { IWidgetDefinition } from "@/types/widget";
import DateTimeCard from "./DateTimeCard.vue";
import DateTimeAddBtn from "./DateTimeAddBtn.vue";
import DateTimeMenuSettings from "./DateTimeMenuSettings.vue";

const widgetDefintion: IWidgetDefinition = {
  widgetType: EWidgetType.DATETIME,
  cardComponent: DateTimeCard,
  menuBtnComponent: DateTimeAddBtn,
  menuSettingsComponent: DateTimeMenuSettings,
}

export default widgetDefintion;
