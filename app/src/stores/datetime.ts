import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import type { IDateTime } from '@/types/widget';

dayjs.extend(utc)
dayjs.extend(timezone)

export const useDateTimeStore = defineStore('datetime', () => {
  const now = ref(new Date())
  const supportedTimezones = ref(Intl.supportedValuesOf('timeZone'))
  const localTimezone = ref(dayjs.tz.guess())
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

  function format(datetime: IDateTime, formatString: string) {
    let dayjsNow = dayjs(now.value)

    if (datetime.timezone) {
      dayjsNow = dayjsNow.tz(datetime.timezone)
    }

    return dayjsNow.format(formatString)
  }

  function isNight(datetime: IDateTime) {
    let dayjsNow = dayjs(now.value)

    if (datetime.timezone) {
      dayjsNow = dayjsNow.tz(datetime.timezone)
    }

    const hour = dayjsNow.hour()

    return hour < 6 || hour > 18
  }

  return {
    now,
    localTimezone,
    supportedTimezones,
    connect,
    disconnect,
    format,
    isNight,
  };
});
