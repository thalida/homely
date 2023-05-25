import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue';
import type { IFont } from '@/types/font';
import { useWidgetStore } from './widget';
import { getFonts } from '@/api/fonts';

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
  const fetchPromise: Ref<Promise<IFont[]> | null> = ref(null)
  const connectedWidgets: Ref<string[]> = ref([])
  const selectedFontFamilies = computed(() => {
    const fontFamilies = connectedWidgets.value.map((widgetId) => {
      const widget = widgetStore.getWidgetById(widgetId)
      if (!widget) {
        return null
      }

      return widget.content.fontFamily
    }).filter((fontFamily) => fontFamily !== null) as string[]

    return [...new Set(fontFamilies)]
  })
  const fontsUrl = computed(() => {
    if (!hasFonts.value || selectedFontFamilies.value.length === 0) {
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

    fetchPromise.value = getFonts()

    const fontsRes = await fetchPromise.value;

    fonts.value = fontsRes;
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
