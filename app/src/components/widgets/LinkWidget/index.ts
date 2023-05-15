import { EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./LinkWidget.vue";

const widgetType = EWidgetType.LINK;

const menuItem: IWidgetMenuItem = {
  widgetType,
  label: 'Link',
  buttons: [
    {
      widgetType,
      content: {
        url: null,
        metadata: {},
        icon: 'link',
      },
      style: {
        id: "icon",
        label: "Icon",
        layout: { w: 1, h: 1 },
      },
    },
    {
      widgetType,
      content: {
        url: null,
        metadata: {},
        icon: 'link',
      },
      style: {
        id: "flag",
        label: "Flag",
        layout: { w: 3, h: 1 },
      },
    },
    {
      widgetType,
      content: {
        url: null,
        metadata: {},
        icon: 'link',
      },
      style: {
        id: "card",
        label: "Card",
        layout: { w: 3, h: 3 },
      },
    },
  ]
}

export default {
  widgetType,
  component,
  menuItem,
}
