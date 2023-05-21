import type { IColor } from "@/types/color";

export function isLightColor(rgbaColor:IColor) {
  const { r, g, b } = rgbaColor;
  return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186)
}
