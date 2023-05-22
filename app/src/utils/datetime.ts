import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import timezone from 'dayjs/plugin/timezone'
import type { IColor } from '@/types/color'

dayjs.extend(utc)
dayjs.extend(advancedFormat)
dayjs.extend(timezone)


const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const TIME_COLORS = [
  { r: 4, g: 10, b: 30 },
  { r: 139, g: 152, b: 206 },
  { r: 86, g: 216, b: 255 },
  { r: 255, g: 216, b: 116 },
  { r: 255, g: 183, b: 116 },
  { r: 255, g: 153, b: 116 },
  { r: 255, g: 103, b: 116 },
  { r: 20, g: 40, b: 116 },
];
const SUNSET_COLOR_IDX = 6;

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

export function getColorBlend(startColor: IColor, endColor: IColor, distance: number) {
  const blendedColor: IColor = {
    r: 0,
    g: 0,
    b: 0,
  };

  const keys: (keyof IColor)[] = Object.keys(startColor) as (keyof IColor)[];
  for (const part of keys) {
    const start = startColor[part];
    const end = endColor[part];
    blendedColor[part] = Math.round(start + (end - start) * distance);
  }

  return blendedColor;
}

export function getColorGradient(timezone: string | null = null, flipAtSunset: boolean = false) {
  const now = Date.now()
  const date = getDayJs(now, timezone)
  const hour = date.hour();
  const minute = date.minute();
  const numSegements = HOURS_IN_DAY / TIME_COLORS.length;
  const startColorIdx = Math.floor(hour / numSegements);
  const endColorIdx =
    startColorIdx + 1 < TIME_COLORS.length ? startColorIdx + 1 : 0;

  const timeInMins = hour * MINUTES_IN_HOUR + minute;
  const startColor = TIME_COLORS[startColorIdx];
  const endColor = TIME_COLORS[endColorIdx];
  const colorStartTimeInMins = startColorIdx * numSegements * MINUTES_IN_HOUR;
  const colorEndTimeInMins =
    endColorIdx === 0
      ? HOURS_IN_DAY * MINUTES_IN_HOUR
      : endColorIdx * numSegements * MINUTES_IN_HOUR;
  const minSinceColorStart = timeInMins - colorStartTimeInMins;
  const minsInColorRange = Math.abs(
    colorEndTimeInMins - colorStartTimeInMins
  );
  const gradientStartDistance =
    minSinceColorStart - 60 >= 0
      ? (minSinceColorStart - 60) / minsInColorRange
      : 0;
  const gradientStart = getColorBlend(
    startColor,
    endColor,
    gradientStartDistance
  );
  const gradientEndDistance = minSinceColorStart / minsInColorRange;
  const gradientEnd = getColorBlend(
    startColor,
    endColor,
    gradientEndDistance
  );

  const gradient = {
    start: gradientStart,
    end: gradientEnd,
  };

  if (startColorIdx >= SUNSET_COLOR_IDX && flipAtSunset) {
    gradient.start = gradientEnd;
    gradient.end = gradientStart;
  }

  return gradient;
}
