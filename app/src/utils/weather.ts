import { EWeatherWidgetUnits } from "@/widgets/WeatherWidget/enums";

export function celsiusToFahrenheit(celsius: number) {
    return (celsius * 1.8) + 32;
}


export function formatTemp(temp: number, unit: EWeatherWidgetUnits) {
    if (unit === EWeatherWidgetUnits.IMPERIAL) {
        temp = celsiusToFahrenheit(temp)
    }

    return Math.round(temp)
}
