import { EWidgetType } from "@/constants/widget";
import type { IWidgetDefinition } from "@/types/widget";
import LinkCard from "./LinkCard.vue";
import LinkAddBtn from "./LinkAddBtn.vue";
import LinkMenuSettings from "./LinkMenuSettings.vue";


const widgetDefintion: IWidgetDefinition = {
  widgetType: EWidgetType.LINK,
  cardComponent: LinkCard,
  menuAddBtnComponent: LinkAddBtn,
  menuSettingsComponent: LinkMenuSettings,
}

export default widgetDefintion;
