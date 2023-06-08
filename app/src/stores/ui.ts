import { defineStore } from 'pinia';
import { watchEffect, type Ref, ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { EAppTheme } from '@/constants/theme';
import type { ESidebarSection } from '@/constants/ui';

export const useUIStore = defineStore('ui', () => {
  const appTheme: Ref<string> = useLocalStorage('homely/space/appTheme', EAppTheme.SYSTEM);
  const isWidgetSidebarOpen = ref(false);
  const isSpaceSidebarOpen = ref(false);
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

  function setIsWidgetSidebarOpen(value: boolean) {
    isWidgetSidebarOpen.value = value;

    return isWidgetSidebarOpen.value;
  }

  function toggleIsWidgetSidebarOpen() {
    isWidgetSidebarOpen.value = !isWidgetSidebarOpen.value;

    return isWidgetSidebarOpen.value;
  }

  function setIsSpaceSidebarOpen(value: boolean) {
    isSpaceSidebarOpen.value = value;

    return isSpaceSidebarOpen.value;
  }

  function toggleIsSpaceSidebarOpen() {
    isSpaceSidebarOpen.value = !isSpaceSidebarOpen.value;

    return isSpaceSidebarOpen.value;
  }

  watchEffect(() => {
    document.documentElement.classList.remove(EAppTheme.DARK, EAppTheme.LIGHT);
    document.documentElement.classList.add(activeTheme.value);
  });

  return {
    appTheme,
    isDarkMode,

    isWidgetSidebarOpen,
    setIsWidgetSidebarOpen,
    toggleIsWidgetSidebarOpen,

    isSpaceSidebarOpen,
    setIsSpaceSidebarOpen,
    toggleIsSpaceSidebarOpen,
  }
});
