import { EWidgetType, type IWidgetButton } from "@/types/widget";
import component from "./TextWidget.vue";

const widgetButtons: IWidgetButton[] = [
  {
    type: EWidgetType.TEXT,
    content: {
      text: null,
      styles: {
        fontFamily: "Lato",
        fontVariant: "regular",
        fontSize: 16,
        horizontalAlignment: "left",
        verticalAlignment: "top",
      },
    },
    style: {
      id: "text",
      label: "Text",
      layout: {
        w: 6,
        h: 1,
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
