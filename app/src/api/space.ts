import axios, { type AxiosResponse } from "axios";
import { API_URL, getConfig } from "@/api/index";
import type { ISpaceResponse } from "@/types/space";

export async function getSpaces(): Promise<ISpaceResponse[]> {
  const url = `${API_URL}/spaces/`;
  const config = getConfig()
  const res = await axios.get<never, AxiosResponse<ISpaceResponse[]>>(url, config)

  return res.data
}

export async function getSpace(id: string): Promise<ISpaceResponse> {
  const url = `${API_URL}/spaces/${id}/`;
  const config = getConfig()
  const res = await axios.get<never, AxiosResponse<ISpaceResponse>>(url, config)

  return res.data
}

export async function createSpace(name: string): Promise<ISpaceResponse> {
  const url = `${API_URL}/spaces/`;
  const config = getConfig()
  const res = await axios.post<never, AxiosResponse<ISpaceResponse>>(url, { name }, config)

  return res.data
}
