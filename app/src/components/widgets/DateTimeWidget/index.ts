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
        datetimes: [
          {
            timezone: null,
            useLocalTime: true,
            format: "dddd, MMMM D YYYY, h:mm:ss a",
          }
        ],
      },
      style: {
        id: "datetime",
        label: "Date & Time",
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
