
import { useUserStore } from '@/stores/user'
import type { IRequestHeaders } from '@/types/api'

const userStore = useUserStore()

export function getConfig() {
  const headers: IRequestHeaders = {}
  const config = {
    withCredentials: true,
    headers,
  }

  if (userStore.accessToken) {
    headers['Authorization'] = `Bearer ${userStore.accessToken}`
  }

  return config
}
