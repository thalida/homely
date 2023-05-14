import { EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./DateTimeWidget.vue";

const widgetType = EWidgetType.DATETIME;

const menuItem: IWidgetMenuItem = {
  label: 'Date and Time',
  widgetType,
  buttons: [
    {
      widgetType,
      content: {
        url: null,
      },
      style: {
        id: "date",
        label: "Date",
        layout: {
          w: 2,
          h: 1,
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
