import type { IBaseWidget, IWidget } from "@/types/widget";
import type { ELinkWidgetStyle } from "./enums";


export interface IBaseLinkWidget extends IBaseWidget {
  content: {
    url: string | null,
    metadata: Record<string, any>,
    style: ELinkWidgetStyle,
    showIcon: boolean,
    showImage: boolean,
    showUrl: boolean,
    showTitle: boolean,
    showDescription: boolean,
    showCustomMetadata: boolean,
  },
  link: string | null,
  original_link: ILink | null,
}

export type TLinkWidget = IBaseLinkWidget & IWidget;

export interface ILink {
  uid: string,
  url: string,
  metadata: Record<string, any>,
}
