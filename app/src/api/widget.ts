import axios, { type AxiosResponse } from "axios";
import { API_URL, getConfig } from "@/api/index";
import type { IBaseWidget, IWidget } from "@/types/widget";


export async function getWidget(widgetId: string) {
  const url = `${API_URL}/widgets/${widgetId}/`;
  const config = getConfig();

  const res = await axios.get<never, AxiosResponse<IWidget>>(url, config);

  return res.data;
}

export async function createWidget(widget: IBaseWidget) {
  const url = `${API_URL}/widgets/`;
  const config = getConfig();

  const res = await axios.post<IBaseWidget, AxiosResponse<IWidget>>(url, widget, config);

  return res.data;
}

export async function updateWidget(widgetId: string, widget: Partial<IWidget>) {
  const url = `${API_URL}/widgets/${widgetId}/`;
  const config = getConfig();

  const res = await axios.patch<Partial<IWidget>, AxiosResponse<IWidget>>(url, widget, config);

  return res.data;
}

export async function deleteWidget(widgetId: string) {
  const url = `${API_URL}/widgets/${widgetId}/`;
  const config = getConfig();

  const res = await axios.delete<never, AxiosResponse<IWidget>>(url, config);

  return res.data;
}
