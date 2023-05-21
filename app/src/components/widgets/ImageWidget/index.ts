import { EImageWidgetBackgroundPosition, EImageWidgetBackgroundRepeat, EImageWidgetBackgroundSize, EWidgetType, type IWidgetMenuItem } from "@/types/widget";
import component from "./ImageWidget.vue";

const widget_type = EWidgetType.IMAGE;

const menuItem: IWidgetMenuItem = {
  label: 'Image',
  widget: {
    widget_type,
    content: {
      url: null,
      backgroundSize: EImageWidgetBackgroundSize.COVER,
      backgroundPosition: EImageWidgetBackgroundPosition.CENTER,
      backgroundRepeat: EImageWidgetBackgroundRepeat.NO_REPEAT,
    },
    card_style: {
      backgroundColor: 'red',
    },
    layout: {
      w: 2,
      h: 2,
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
