import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
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

export function isNightTime(date: Date | number, timezone?: string | null) {
  const dayjsNow = getDayJs(date, timezone)

  const hour = dayjsNow.hour()

  return hour < 6 || hour > 18
}

export function format(date: Date | number, formatString: string, timezone?: string | null) {
  console.log('format', date, formatString, timezone)
  const dayjsDate = getDayJs(date, timezone)

  return dayjsDate.format(formatString)
}
