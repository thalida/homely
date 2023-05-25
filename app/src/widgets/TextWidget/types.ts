import type { IBaseWidget, IWidget } from "@/types/widget"

export interface IBaseTextWidget extends IBaseWidget {
  content: {
    text: string
    isInteractive: boolean
    fontFamily: string
    fontVariant: string
    fontSize: number
    textAlign: string
    lineHeight: number
  }
}

export type TTextWidget = IBaseTextWidget & IWidget;
