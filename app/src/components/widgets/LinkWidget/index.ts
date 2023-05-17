import { ELinkWidgetStyle, EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./LinkWidget.vue";

const widgetType = EWidgetType.LINK;

const menuItem: IWidgetMenuItem = {
  label: 'Link',
  widget: {
    widgetType,
    content: {
      url: null,
      metadata: {},
      useCustomIcon: false,
      icon: 'link',
      style: ELinkWidgetStyle.FLAG,
    },
    layout: {
      w: 3,
      h: 2,
      isResizable: true,
      preserveAspectRatio: false,
    },
  }
}

export default {
  widgetType,
  component,
  menuItem,
}
