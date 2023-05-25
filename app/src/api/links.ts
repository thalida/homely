import axios, { type AxiosResponse } from 'axios'
import { API_URL, getConfig } from '.'
import type { ILink } from '@/widgets/LinkWidget/types';

export async function getLinkByUrl(linkUrl: string) {
  const url = `${API_URL}/links/`;
  const config = getConfig();

  const res = await axios.post<{url: string}, AxiosResponse<ILink>>(url, { url: linkUrl },  config)

  return res.data
}
