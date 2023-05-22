import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import * as datetimeUtils from '@/utils/datetime';

export const useDateTimeStore = defineStore('datetime', () => {
  const now = ref(new Date())
  const supportedTimezones = ref(Intl.supportedValuesOf('timeZone'))
  const localTimezone = ref(datetimeUtils.guessTimezone())
  const interval: Ref<number | null> = ref(null)
  const connectedWidgets: Ref<string[]> = ref([])

  function connect(widgetId: string) {
    connectedWidgets.value.push(widgetId)
    startInterval()
  }

  function disconnect(widgetId: string) {
    const index = connectedWidgets.value.indexOf(widgetId)
    if (index === -1) {
      return;
    }

    connectedWidgets.value.splice(index, 1)

    if(connectedWidgets.value.length === 0) {
      stopInterval()
    }
  }


  function startInterval() {
    if (interval.value) {
      return;
    }

    interval.value = window.setInterval(() => {
      now.value = new Date()
    }, 1000)
  }

  function stopInterval() {
    if (!interval.value) {
      return;
    }

    window.clearInterval(interval.value)
    interval.value = null
  }

  function format(formatString: string, timezone: string | null = null) {
    return datetimeUtils.format(now.value, formatString, timezone)
  }

  function getTimeOfDay(timezone: string | null = null) {
    return datetimeUtils.timeOfDay(now.value, timezone)
  }

  return {
    now,
    localTimezone,
    supportedTimezones,
    connect,
    disconnect,
    format,
    getTimeOfDay,
  };
});
