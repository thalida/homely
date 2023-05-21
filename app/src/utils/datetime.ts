import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(advancedFormat)
dayjs.extend(timezone)


export function guessTimezone(): string {
  return dayjs.tz.guess()
}

export function getDayJs(date: Date | number, timezone?: string | null) {
  let dayjsDate = dayjs(date)

  if (timezone) {
    dayjsDate = dayjsDate.tz(timezone)
  }

  return dayjsDate
}

export function now() {
  return dayjs()
}

export function timeOfDay(date: Date | number, timezone?: string | null) {
  const dayjsNow = getDayJs(date, timezone)

  const hour = dayjsNow.hour()

  if (hour < 5) {
    return 'night'
  } else if (hour < 9) {
    return 'sunrise'
  } else if (hour < 17) {
    return 'day'
  } else if (hour < 20) {
    return 'sunset'
  } else {
    return 'night'
  }
}

export function format(date: Date | number, formatString: string, timezone?: string | null) {
  const dayjsDate = getDayJs(date, timezone)

  return dayjsDate.format(formatString)
}
