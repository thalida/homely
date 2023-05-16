import { EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./ImageWidget.vue";

const widgetType = EWidgetType.IMAGE;

const menuItem: IWidgetMenuItem = {
  label: 'Image',
  widget: {
    widgetType,
    content: {
      url: null,
    },
    style: {
      name: "default",
      layout: {
        w: 2,
        h: 2,
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
