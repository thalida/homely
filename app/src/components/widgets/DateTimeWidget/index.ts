import { DEFAULT_WIDGET_COLOR, EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./DateTimeWidget.vue";

const widget_type = EWidgetType.DATETIME;

const menuItem: IWidgetMenuItem = {
  label: 'Date and Time',
  widget: {
    widget_type,
    content: {
      items: [
        {
          timezone: null,
          useCurrentLocation: true,
          formatLine1: "h:mm A",
          formatLine2: "dddd, MMMM D",
          showLocation: true,
          showLine1: true,
          showLine2: true,
          showDynamicIcon: true,
          showDynamicBackground: true,
        }
      ],
    },
    card_style: {
      background_color: DEFAULT_WIDGET_COLOR,
    },
    layout: {
      w: 3,
      h: 1,
      isResizable: true,
      preserveAspectRatio: false,
    },
  },
}

export default {
  widget_type,
  component,
  menuItem,
}
