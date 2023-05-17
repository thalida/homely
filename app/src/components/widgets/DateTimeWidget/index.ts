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
          showIsLocalTimeLabel: true,
          formatLine1: "h:mm A",
          formatLine2: "dddd, MMMM D",
          showCity: true,
          showLine1: true,
          showLine2: true,
          showDayNightIcon: true,
          showDayNightBackground: true,
        }
      ],
    },
    layout: {
      w: 2,
      h: 1,
      isResizable: true,
      preserveAspectRatio: false,
    },
  },
}

export default {
  widgetType,
  component,
  menuItem,
}
