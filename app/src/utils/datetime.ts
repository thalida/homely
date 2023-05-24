import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import type { IColor } from '@/types/color'

dayjs.extend(utc)
dayjs.extend(advancedFormat)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)


const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const TIME_COLORS: IColor[] = [
  { r: 0, g: 32, b: 55 },
  { r: 0, g: 53, b: 94 },
  { r: 7, g: 77, b: 129 },
  { r: 24, g: 106, b: 167 },
  { r: 39, g: 134, b: 203 },
  { r: 64, g: 183, b: 234 },
  { r: 100, g: 207, b: 253 },
  { r: 100, g: 225, b: 253 },
  { r: 255, g: 223, b: 111 },
  { r: 255, g: 171, b: 111 },
  { r: 39, g: 75, b: 203 },
  { r: 14, g: 48, b: 171 },
];

const SUNRISE_COLOR_IDX = 3;
const SUNSET_COLOR_IDX = 8;

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

export function getRealisticColorGradient({ sunsetTime, sunriseTime }: { sunsetTime: Dayjs, sunriseTime: Dayjs }, timezone: string | null = null): {
  start: IColor,
  end: IColor,
} {
  if (!sunsetTime.isValid() || !sunriseTime.isValid()) {
    return {
      start: TIME_COLORS[SUNRISE_COLOR_IDX],
      end: TIME_COLORS[SUNRISE_COLOR_IDX],
    };
  }

  const now = getDayJs(Date.now(), timezone);
  const pastTime = now.subtract(2, 'hour');

  const gradientStart = getRealisticColor(pastTime, { sunsetTime, sunriseTime });
  const gradientEnd = getRealisticColor(now, { sunsetTime, sunriseTime });

  let gradient;

  if (now >= sunsetTime) {
    gradient = {
      start: gradientEnd,
      end: gradientStart,
    };
  } else {
    gradient = {
      start: gradientStart,
      end: gradientEnd,
    };
  }

  return gradient;
}

function getRealisticColor(now: Dayjs, { sunsetTime, sunriseTime }: { sunsetTime: Dayjs, sunriseTime: Dayjs }) {
  let colorPhase, phaseStartTime, phaseEndTime;
  if (now < sunriseTime) {
    colorPhase = TIME_COLORS.slice(0, SUNRISE_COLOR_IDX + 1);
    phaseStartTime = sunriseTime.startOf('day');
    phaseEndTime = sunriseTime;
  } else if (now >= sunsetTime) {
    colorPhase = TIME_COLORS.slice(SUNSET_COLOR_IDX);
    colorPhase.push(TIME_COLORS[0]);
    phaseStartTime = sunsetTime;
    phaseEndTime = sunsetTime.endOf('day');
  } else {
    colorPhase = TIME_COLORS.slice(SUNRISE_COLOR_IDX, SUNSET_COLOR_IDX + 1);
    phaseStartTime = sunriseTime;
    phaseEndTime = sunsetTime;
  }

  const nowMs = now.valueOf();
  const phaseStartTimeMs = phaseStartTime.valueOf();
  const phaseEndTimeMs = phaseEndTime.valueOf();

  const timeSinceStart = Math.abs(nowMs - phaseStartTimeMs);
  const timeInPhase = phaseEndTimeMs - phaseStartTimeMs;
  const distance = timeSinceStart / timeInPhase;
  const phaseSegments = timeInPhase / (colorPhase.length - 1);
  const startColorIdx = Math.floor((colorPhase.length - 1) * distance);
  const endColorIdx = startColorIdx + 1;
  const startColorTime = phaseStartTimeMs + startColorIdx * phaseSegments;
  const endColorTime = phaseStartTimeMs + endColorIdx * phaseSegments;
  const timeInSegment = endColorTime - startColorTime;
  const timeSinceSegmentStart = nowMs - startColorTime;
  const distanceInSegment = timeSinceSegmentStart / timeInSegment;
  const startColor = colorPhase[startColorIdx];
  const endColor = colorPhase[endColorIdx];

  const color = getColorBlend(startColor, endColor, distanceInSegment);
  return color;
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
