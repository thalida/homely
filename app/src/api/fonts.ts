import type { IFont } from "@/types/font";
import axios from "axios";


export async function getFonts(): Promise<IFont[]> {
  const res = await axios.get<{items: IFont[]}>('https://www.googleapis.com/webfonts/v1/webfonts', {
    params: {
      key: import.meta.env.VITE_GOOGLE_FONTS_API_KEY,
      sort: 'alpha',
    },
  })

  return res.data.items
}
