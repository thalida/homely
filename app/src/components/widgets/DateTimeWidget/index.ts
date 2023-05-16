import { EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./DateTimeWidget.vue";

const widgetType = EWidgetType.DATETIME;

const menuItem: IWidgetMenuItem = {
  label: 'Date and Time',
  widget: {
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
      name: 'default',
      layout: {
        w: 2,
        h: 1,
        isResizable: true,
        preserveAspectRatio: false,
      },
    },
  },
}

export default {
  widgetType,
  component,
  menuItem,
}
