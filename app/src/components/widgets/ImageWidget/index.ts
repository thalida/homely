import { EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./ImageWidget.vue";

const widgetType = EWidgetType.IMAGE;

const menuItem: IWidgetMenuItem = {
  label: 'Image',
  widgetType,
  buttons: [
    {
      widgetType,
      content: {
        url: null,
      },
      style: {
        id: "sm",
        label: "Icon",
        layout: {
          w: 2,
          h: 2,
          isResizable: true,
          preserveAspectRatio: false,
        },
      },
    },
  ],
}

export default {
  widgetType,
  component,
  menuItem,
}
