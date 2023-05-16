import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed, type Ref } from 'vue';
import type { IFont } from '@/types/font';
import { useWidgetStore } from './widget';

export const useFontStore = defineStore('font', () => {
  const widgetStore = useWidgetStore()
  const fonts: Ref<IFont[]> = ref([])
  const fontsByFamily: Ref<Record<string, IFont>> = computed(() => {
    return fonts.value.reduce((acc, font) => {
      acc[font.family] = font
      return acc
    }, {} as Record<string, IFont>)
  })

  const hasFonts = computed(() => fonts.value.length > 0)
  const fetchPromise: Ref<Promise<any> | null> = ref(null)
  const connectedWidgets: Ref<string[]> = ref([])
  const selectedFontFamilies = computed(() => {
    const fontFamilies = connectedWidgets.value.map((widgetId) => {
      const widget = widgetStore.getWidgetById(widgetId)
      if (!widget) {
        return null
      }

      return widget.content.styles.fontFamily
    }).filter((fontFamily) => fontFamily !== null) as string[]

    return [...new Set(fontFamilies)]
  })
  const fontsUrl = computed(() => {
    if (!hasFonts.value) {
      return null
    }

    const families = []
    for (const fontFamily of selectedFontFamilies.value) {
      const font = fontsByFamily.value[fontFamily]
      if (!font) {
        continue
      }

      const familyName = font.family.replace(/ /g, '+')
      const variants = font.variants.join(',')
      families.push(`${familyName}:${variants}`)
    }

    return `https://fonts.googleapis.com/css?family=${families.join('|') }&display=swap`
  });

  async function loadFonts() {
    if (fetchPromise.value) {
      return fetchPromise.value;
    }

    if (hasFonts.value) {
      return Promise.resolve(fonts.value);
    }

    fetchPromise.value = axios.get('https://www.googleapis.com/webfonts/v1/webfonts', {
      params: {
        key: import.meta.env.VITE_GOOGLE_FONTS_API_KEY,
        sort: 'alpha',
      },
    });

    const res = await fetchPromise.value;

    fonts.value = res.data.items;
    return fonts.value;
  }

  function connect(widgetId: string) {
    connectedWidgets.value.push(widgetId)
  }

  function disconnect(widgetId: string) {
    const index = connectedWidgets.value.indexOf(widgetId)
    if (index === -1) {
      return;
    }

    connectedWidgets.value.splice(index, 1)
  }

  return {
    fonts,
    fontsByFamily,
    loadFonts,
    selectedFontFamilies,
    fontsUrl,
    connect,
    disconnect,
  };
});
