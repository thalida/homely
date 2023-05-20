import { ref, type Ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import axios from 'axios';
import { defineStore } from 'pinia';
import type { IUser } from '@/types/user';

export const useUserStore = defineStore('user', () => {
  const accessToken: Ref<string | null> = useLocalStorage('homely/user/accessToken', null)
  const refreshToken: Ref<string | null> = useLocalStorage('homely/user/refreshToken', null)
  const user: Ref<IUser | null> = ref(null)
  const isAuthenticated = ref(false)

  async function getUser() {
    if (!accessToken.value) {
      return;
    }

    const res = await axios.get('http://localhost:8000/api/auth/user/', {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    user.value = res.data
  }

  async function verifyAccessToken(): Promise<boolean> {
    if (!accessToken.value) {
      return false;
    }

    try {
      const accessRes = await axios.post('http://localhost:8000/api/auth/token/verify/', {
        token: accessToken.value,
      });

      if (accessRes.data.code === 'token_not_valid') {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  async function verifyRefreshToken() {
    if (!refreshToken.value) {
      return false;
    }

    try {
      const refreshRes = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
        refresh: refreshToken.value,
      })

      if (refreshRes.data.code === 'token_not_valid') {
        return false;
      }

      accessToken.value = refreshRes.data.access
      return true
    } catch (err) {
      return false;
    }
  }

  async function autoLogin() {
    const isValidAccessToken = await verifyAccessToken()

    if (isValidAccessToken) {
      await getUser()
      isAuthenticated.value = true
      return isAuthenticated.value;
    }

    const isValidRefreshToken = await verifyRefreshToken()

    if (isValidRefreshToken) {
      await getUser()
      isAuthenticated.value = true
      return isAuthenticated.value;
    }

    accessToken.value = null
    refreshToken.value = null
    isAuthenticated.value = false
    return isAuthenticated.value;
  }

  async function loginWithGoogle(googleToken: string) {
    const res = await axios.post('http://localhost:8000/api/auth/google/', {
      access_token: googleToken,
    })

    accessToken.value = res.data.access
    refreshToken.value = res.data.refresh
    user.value = res.data.user
    isAuthenticated.value = true
  }

  async function logout() {
    await axios.post('http://localhost:8000/api/auth/logout/', {}, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    })

    isAuthenticated.value = false
    accessToken.value = null
    refreshToken.value = null
    user.value = null
  }


  return {
    accessToken,
    user,
    isAuthenticated,
    autoLogin,
    loginWithGoogle,
    logout,
  }
});
