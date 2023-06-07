import { defineStore } from 'pinia';
import { watchEffect, type Ref, ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { EAppTheme } from '@/constants/theme';
import type { ESidebarSection } from '@/constants/ui';

export const useUIStore = defineStore('ui', () => {
  const appTheme: Ref<string> = useLocalStorage('homely/space/appTheme', EAppTheme.SYSTEM);
  const activeSidebar: Ref<Record<string, ESidebarSection | null>> = ref({})
  const activeTheme = computed(() => {
    if (appTheme.value === EAppTheme.LIGHT || appTheme.value === EAppTheme.DARK) {
      return appTheme.value;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? EAppTheme.DARK : EAppTheme.LIGHT;
  });
  const isDarkMode = computed({
    get: () => activeTheme.value === EAppTheme.DARK,
    set: (value: boolean) => {
      appTheme.value = value ? EAppTheme.DARK : EAppTheme.LIGHT;

      return value;
    }
  });

  function setActiveSidebar(spaceId:string, section: ESidebarSection | null) {
    activeSidebar.value[spaceId] = section
  }

  function toggleActiveSidebar(spaceId: string, section: ESidebarSection) {
    if (activeSidebar.value[spaceId] === section) {
      activeSidebar.value[spaceId] = null
    } else {
      activeSidebar.value[spaceId] = section
    }

    return activeSidebar.value[spaceId]
  }

  watchEffect(() => {
    document.documentElement.classList.remove(EAppTheme.DARK, EAppTheme.LIGHT);
    document.documentElement.classList.add(activeTheme.value);
  });

  return {
    appTheme,
    isDarkMode,

    activeSidebar,
    setActiveSidebar,
    toggleActiveSidebar,
  }
});
