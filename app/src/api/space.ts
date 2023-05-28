import axios, { type AxiosResponse } from "axios";
import { API_URL, getConfig } from "@/api/index";
import type { ISpace, ISpaceResponse } from "@/types/space";

export async function getSpaces(params?:Record<string, any>): Promise<ISpaceResponse[]> {
  const url = `${API_URL}/spaces/`;
  const config = getConfig()
  const res = await axios.get<never, AxiosResponse<ISpaceResponse[]>>(url, {...config, params})

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


export async function updateSpace(id: string, data: Partial<ISpaceResponse>): Promise<ISpaceResponse> {
  const url = `${API_URL}/spaces/${id}/`;
  const config = getConfig()
  const res = await axios.patch<Partial<ISpaceResponse>, AxiosResponse<ISpaceResponse>>(url, data, config)

  return res.data
}

export async function deleteSpace(id: string): Promise<ISpaceResponse> {
  const url = `${API_URL}/spaces/${id}/`;
  const config = getConfig()
  const res = await axios.delete<never, AxiosResponse<ISpaceResponse>>(url, config)

  return res.data
}

export async function toggleSpaceBookmark(id: string): Promise<ISpaceResponse> {
  const url = `${API_URL}/spaces/${id}/toggle-bookmark/`;
  const config = getConfig()
  const res = await axios.post<never, AxiosResponse<ISpaceResponse>>(url, {}, config)

  return res.data
}

export async function cloneSpace(id: string): Promise<ISpaceResponse> {
  const url = `${API_URL}/spaces/${id}/clone/`;
  const config = getConfig()
  const res = await axios.post<never, AxiosResponse<ISpaceResponse>>(url, {}, config)

  return res.data
}
