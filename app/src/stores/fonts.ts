import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed, type Ref } from 'vue';
import type { IFont } from '@/types/font';

export const useFontStore = defineStore('font', () => {
  const fonts: Ref<IFont[]> = ref([])
  const fontsByFamily: Ref<Record<string, IFont>> = computed(() => {
    return fonts.value.reduce((acc, font) => {
      acc[font.family] = font
      return acc
    }, {} as Record<string, IFont>)
  })

  const loading = ref(false)
  const hasFonts = computed(() => fonts.value.length > 0)
  const fetchPromise: Ref<Promise<any> | null> = ref(null)

  async function loadFonts() {
    if (fetchPromise.value) {
      return fetchPromise.value;
    }

    if (hasFonts.value) {
      return Promise.resolve(fonts.value);
    }

    loading.value = true;

    fetchPromise.value = axios.get('https://www.googleapis.com/webfonts/v1/webfonts', {
      params: {
        key: import.meta.env.VITE_GOOGLE_FONTS_API_KEY,
        sort: 'alpha',
      },
    });

    const res = await fetchPromise.value;

    fonts.value = res.data.items;
    loading.value = false;
    return fonts.value;
  }

  return {
    fonts,
    fontsByFamily,
    loadFonts
  };
});
