import { ref, type Ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { IUser } from '@/types/user';
import {
  getMe as getMeReq,
  verifyAccessToken as verifyAccessTokenReq,
  verifyRefreshToken as verifyRefreshTokenReq,
  loginWithGoogle as loginWithGoogleReq,
  logout as logoutReq,
} from '@/api/user';
import { useSpaceStore } from '@/stores/space';

export const useUserStore = defineStore('user', () => {
  const spaceStore = useSpaceStore()
  const accessToken: Ref<string | null> = useLocalStorage('homely/user/accessToken', null)
  const refreshToken: Ref<string | null> = useLocalStorage('homely/user/refreshToken', null)
  const user: Ref<IUser | null> = ref(null)
  const isAuthenticated = ref(false)

  async function getMe() {
    if (!accessToken.value) {
      return;
    }

    const userRes = await getMeReq()

    user.value = userRes

    spaceStore.initSpaces(userRes.spaces)
    return user.value;
  }

  async function verifyAccessToken(): Promise<boolean> {
    if (!accessToken.value) {
      return false;
    }

    return await verifyAccessTokenReq(accessToken.value)
  }

  async function verifyRefreshToken() {
    if (!refreshToken.value) {
      return false;
    }

    const res = await verifyRefreshTokenReq(refreshToken.value)

    if (!res) {
      return false;
    }

    accessToken.value = res
    return true;
  }

  async function autoLogin() {
    await getMe()

    if (user.value) {
      isAuthenticated.value = true
      return isAuthenticated.value;
    }

    accessToken.value = null
    refreshToken.value = null
    isAuthenticated.value = false
    return isAuthenticated.value;
  }

  async function loginWithGoogle(googleToken: string) {
    const res = await loginWithGoogleReq(googleToken)

    accessToken.value = res.access_token
    refreshToken.value = res.refresh_token
    await getMe()
    isAuthenticated.value = true
  }

  async function logout() {
    await logoutReq()

    isAuthenticated.value = false
    accessToken.value = null
    refreshToken.value = null
    user.value = null

    window.location.href = '/'
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
