import { EWidgetType } from "@/constants/widget";
import type { IWidgetDefinition } from "@/types/widget";
import ImageCard from "./ImageCard.vue";
import ImageAddBtn from "./ImageAddBtn.vue";
import ImageMenuSettings from "./ImageMenuSettings.vue";

const widgetDefintion: IWidgetDefinition = {
  widgetType: EWidgetType.IMAGE,
  cardComponent: ImageCard,
  menuAddBtnComponent: ImageAddBtn,
  menuSettingsComponent: ImageMenuSettings,
}

export default widgetDefintion;
