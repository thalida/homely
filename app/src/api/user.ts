import axios, { type AxiosResponse } from "axios";
import { API_URL, getConfig } from "@/api/index";
import type { IGoogleResponse, IUser } from "@/types/user";


export async function getMe() {
  const url = `${API_URL}/users/me/`;
  const config = getConfig()

  const res = await axios.get<never, AxiosResponse<IUser>>(url, config)

  return res.data
}

export async function updateMe(data: Partial<IUser>) {
  const url = `${API_URL}/users/me/`;
  const config = getConfig()

  const res = await axios.patch<Partial<IUser>, AxiosResponse<IUser>>(url, data, config)

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
  // const url = `${API_URL}/auth/google/`;
  const url = `${API_URL}/auth/convert-token/`;

  const res = await axios.post<{access_token: string}, AxiosResponse<IGoogleResponse>>(url, {
    token: googleToken,
    grant_type: 'convert_token',
    backend: 'google-oauth2',
    client_id: '7GktguvFMAVlehjYzlHvgAGkkQ49jwCFvfCGzdxQ',
    client_secret: 'KgkvY3g0TVORQUV3LLkPWNq4AhDucLWHuWTVMaEzp4hO15mVXv2MzT9ydI6bhFy6ZARhEsjOdgdIb1PBvUyaHOkuE8z5KXrXUNIiB8PdHJJTsSU9iasdB8VT3P8D6NGO',
  })

  return res.data
}

export async function logout() {
  const url = `${API_URL}/auth/invalidate-sessions/`;
  const config = getConfig()

  const res = await axios.post(url, {
    client_id: '7GktguvFMAVlehjYzlHvgAGkkQ49jwCFvfCGzdxQ',
  }, config)

  return res.data
}
