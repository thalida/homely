import { DEFAULT_WIDGET_COLOR, ELinkWidgetStyle, EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./LinkWidget.vue";

const widget_type = EWidgetType.LINK;

const menuItem: IWidgetMenuItem = {
  label: 'Link',
  widget: {
    widget_type,
    content: {
      url: null,
      style: ELinkWidgetStyle.FLAG,
      showIcon: true,
      showImage: true,
      showUrl: true,
      showTitle: true,
      showDescription: true,
      metadata: {},
    },
    card_style: {
      background_color: DEFAULT_WIDGET_COLOR,
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
  widget_type,
  component,
  menuItem,
}
