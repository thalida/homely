import { EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./TextWidget.vue";

const widgetType = EWidgetType.TEXT;
const menuItem: IWidgetMenuItem = {
  label: 'Text',
  widget: {
    widgetType,
    content: {
      text: null,
      isInteractive: false,
      styles: {
        fontFamily: "Lato",
        fontVariant: "regular",
        fontSize: 16,
        textAlign: "left",
      },
    },
    style: {
      name: "default",
      layout: {
        w: 6,
        h: 1,
        isResizable: true,
        preserveAspectRatio: false,
      },
    },
  },
}

export default {
  widgetType,
  component,
  menuItem,
}
