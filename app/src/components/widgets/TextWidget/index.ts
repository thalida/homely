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
      fontFamily: "Lato",
      fontVariant: "regular",
      fontSize: 16,
      textAlign: "left",
      lineHeight: 1.5,
    },
    layout: {
      w: 3,
      h: 3,
      isResizable: true,
      preserveAspectRatio: false,
    },
  },
}

export default {
  widgetType,
  component,
  menuItem,
}
