import { EWidgetType, type IWidgetButton } from "@/types/widget";
import component from "./ImageWidget.vue";

const widgetButtons: IWidgetButton[] = [
  {
    type: EWidgetType.IMAGE,
    content: {
      url: null,
    },
    style: {
      id: "sm",
      label: "Icon",
      layout: { w: 2, h: 2 },
    },
  },
];

const menuItem = {
  id: EWidgetType.IMAGE,
  label: 'Image',
  buttons: widgetButtons
}

export default {
  type: EWidgetType.IMAGE,
  component,
  menuItem,
}
