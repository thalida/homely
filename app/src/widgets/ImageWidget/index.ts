import { EWidgetType } from "@/enums/widget";
import type { IWidgetDefinition } from "@/types/widget";
import ImageCard from "./ImageCard.vue";
import ImageMenuBtn from "./ImageMenuBtn.vue";
import ImageMenuSettings from "./ImageMenuSettings.vue";

const widgetDefintion: IWidgetDefinition = {
  widgetType: EWidgetType.IMAGE,
  cardComponent: ImageCard,
  menuBtnComponent: ImageMenuBtn,
  menuSettingsComponent: ImageMenuSettings,
}

export default widgetDefintion;
