import { EWidgetType, type IWidgetButton } from "@/stores/widget";
import component from "./LinkWidget.vue";

const widgetButtons: IWidgetButton[] = [
  {
    name: "Icon",
    widget: {
      type: EWidgetType.LINK,
      content: null,
    },
    layout: { w: 1, h: 1 },
  },
  {
    name: "Flag",
    widget: {
      type: EWidgetType.LINK,
      content: null,
    },
    layout: { w: 3, h: 1 },
  },
  {
    name: "Card",
    widget: {
      type: EWidgetType.LINK,
      content: null,
    },
    layout: { w: 3, h: 3 },
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
