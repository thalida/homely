import { EWidgetType, type IWidgetButton } from "@/types/widget";
import component from "./LinkWidget.vue";

const widgetButtons: IWidgetButton[] = [
  {
    type: EWidgetType.LINK,
    content: {
      url: null,
    },
    style: {
      id: "icon",
      label: "Icon",
      layout: { w: 1, h: 1 },
    },
  },
  {
    type: EWidgetType.LINK,
    content: {
      url: null,
    },
    style: {
      id: "flag",
      label: "Flag",
      layout: { w: 3, h: 1 },
    },
  },
  {
    type: EWidgetType.LINK,
    content: {
      url: null,
    },
    style: {
      id: "card",
      label: "Card",
      layout: { w: 3, h: 3 },
    },
  },
];

const menuItem = {
  id: EWidgetType.LINK,
  label: 'Link',
  buttons: widgetButtons
}

export default {
  type: EWidgetType.LINK,
  component,
  menuItem,
}
