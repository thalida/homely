import { EWidgetType } from "@/constants/widget";
import type { IWidgetDefinition } from "@/types/widget";
import TextCard from "./TextCard.vue";
import TextMenuBtn from "./TextMenuBtn.vue";
import TextMenuSettings from "./TextMenuSettings.vue";


const widgetDefintion: IWidgetDefinition = {
  widgetType: EWidgetType.TEXT,
  cardComponent: TextCard,
  menuBtnComponent: TextMenuBtn,
  menuSettingsComponent: TextMenuSettings,
}

export default widgetDefintion;
