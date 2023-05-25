import { EWidgetType } from "@/enums/widget";
import type { IWidgetDefinition } from "@/types/widget";
import LinkCard from "./LinkCard.vue";
import LinkMenuBtn from "./LinkMenuBtn.vue";
import LinkMenuSettings from "./LinkMenuSettings.vue";


const widgetDefintion: IWidgetDefinition = {
  widgetType: EWidgetType.LINK,
  cardComponent: LinkCard,
  menuBtnComponent: LinkMenuBtn,
  menuSettingsComponent: LinkMenuSettings,
}

export default widgetDefintion;
