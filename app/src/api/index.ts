import { useUserStore } from '@/stores/user'

export const API_URL = import.meta.env.VITE_API_URL

export function getConfig() {
  const userStore = useUserStore()
  const headers: { [key:string]: any } = {}
  const config = {
    withCredentials: true,
    headers,
  }

  if (userStore.accessToken) {
    headers['Authorization'] = `Bearer ${userStore.accessToken}`
  }

  return config
}
