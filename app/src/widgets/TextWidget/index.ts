import { EWidgetType } from "@/constants/widget";
import type { IWidgetDefinition } from "@/types/widget";
import TextCard from "./TextCard.vue";
import TextAddBtn from "./TextAddBtn.vue";
import TextMenuSettings from "./TextMenuSettings.vue";


const widgetDefintion: IWidgetDefinition = {
  widgetType: EWidgetType.TEXT,
  cardComponent: TextCard,
  menuAddBtnComponent: TextAddBtn,
  menuSettingsComponent: TextMenuSettings,
}

export default widgetDefintion;
