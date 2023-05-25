import axios, { type AxiosResponse } from "axios";
import { API_URL, getConfig } from "@/api/index";
import type { IGoogleResponse, IUser } from "@/types/user";


export async function getUser() {
  const url = `${API_URL}/auth/user/`;
  const config = getConfig()

  const res = await axios.get<never, AxiosResponse<IUser>>(url, config)

  return res.data
}

export async function verifyAccessToken(accessToken: string): Promise<boolean> {
  const url = `${API_URL}/auth/token/verify/`;

  try {
    const res = await axios.post(url, {
      token: accessToken,
    })

    if (res.data.code === 'token_not_valid') {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

export async function verifyRefreshToken(refreshToken: string): Promise<string | null> {
  const url = `${API_URL}/auth/token/refresh/`;

  try {
    const res = await axios.post(url, {
      refresh: refreshToken,
    })

    if (res.data.code === 'token_not_valid') {
      return null;
    }

    return res.data.access;
  } catch (err) {
    return null;
  }
}


export async function loginWithGoogle (googleToken: string) {
  const url = `${API_URL}/auth/google/`;

  const res = await axios.post<{access_token: string}, AxiosResponse<IGoogleResponse>>(url, {
    access_token: googleToken,
  })

  return res.data
}

export async function logout() {
  const url = `${API_URL}/auth/logout/`;
  const config = getConfig()

  const res = await axios.post(url, {}, config)

  return res.data
}
