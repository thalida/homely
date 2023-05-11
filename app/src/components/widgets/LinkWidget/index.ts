import { EWidgetType, type IWidgetButton } from "@/stores/widget";

export const widgetButtons: IWidgetButton[] = [
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
    layout: { w: 2, h: 3 },
  },
];
