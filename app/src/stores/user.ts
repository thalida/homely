import { ref, type Ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { IUser } from '@/types/user';
import {
  getUser as getUserReq,
  verifyAccessToken as verifyAccessTokenReq,
  verifyRefreshToken as verifyRefreshTokenReq,
  loginWithGoogle as loginWithGoogleReq,
  logout as logoutReq,
} from '@/api/user';
import { useSpaceStore } from '@/stores/space';
import router from '@/router';

export const useUserStore = defineStore('user', () => {
  const spaceStore = useSpaceStore()
  const accessToken: Ref<string | null> = useLocalStorage('homely/user/accessToken', null)
  const refreshToken: Ref<string | null> = useLocalStorage('homely/user/refreshToken', null)
  const user: Ref<IUser | null> = ref(null)
  const isAuthenticated = ref(false)

  async function getUser() {
    if (!accessToken.value) {
      return;
    }

    const userRes = await getUserReq()

    user.value = userRes

    spaceStore.initSpaces(userRes.spaces)
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
    const res = await loginWithGoogleReq(googleToken)

    accessToken.value = res.access
    refreshToken.value = res.refresh
    isAuthenticated.value = true
    user.value = res.user
    spaceStore.initSpaces(res.user.spaces)
  }

  async function logout() {
    await logoutReq()

    isAuthenticated.value = false
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    spaceStore.initSpaces([])
    spaceStore.isEditMode = false

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
