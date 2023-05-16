import { EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./LinkWidget.vue";

const widgetType = EWidgetType.LINK;

const menuItem: IWidgetMenuItem = {
  label: 'Link',
  widget: {
    widgetType,
    content: {
      url: null,
      metadata: {},
      icon: null,
      useCustomIcon: false,
    },
    style: {
      name: 'default',
      layout: {
        w: 1,
        h: 1,
        isResizable: true,
        preserveAspectRatio: false,
      },
    },
  }
}

export default {
  widgetType,
  component,
  menuItem,
}
