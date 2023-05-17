import { ELinkWidgetStyle, EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./LinkWidget.vue";

const widgetType = EWidgetType.LINK;

const menuItem: IWidgetMenuItem = {
  label: 'Link',
  widget: {
    widgetType,
    content: {
      url: null,
      style: ELinkWidgetStyle.FLAG,
      useCustomIcon: false,
      icon: 'link',
      showImage: true,
      showUrl: true,
      showTitle: true,
      showDescription: true,
      metadata: {},
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
