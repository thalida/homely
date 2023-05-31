import type { IBaseWidget, IWidget } from "@/types/widget";
import type { EImageWidgetBackgroundSize } from "./constants";

export interface IBaseImageWidget extends IBaseWidget {
  content: {
    url: string | null,
    backgroundSize: EImageWidgetBackgroundSize,
    backgroundPosition: string,
    backgroundRepeat: string,
  }
}

export type TImageWidget = IBaseImageWidget & IWidget;
