import { EWidgetType, type IWidgetButton } from "@/stores/widget";
import component from "./TextWidget.vue";

const widgetButtons: IWidgetButton[] = [
  {
    type: EWidgetType.TEXT,
    content: {
      url: null,
    },
    style: {
      id: "text",
      label: "Text",
      layout: {
        w: 6,
        h: 6,
        isResizable: true,
        preserveAspectRatio: false,
      },
    },
  },
];

const menuItem = {
  id: EWidgetType.TEXT,
  label: 'Text',
  buttons: widgetButtons
}

export default {
  type: EWidgetType.TEXT,
  component,
  menuItem,
}
