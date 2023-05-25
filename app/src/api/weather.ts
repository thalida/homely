import axios from "axios";

export async function getWeather (latlng: { lat: number, lng: number }, units: string) {
  const url = "https://api.openweathermap.org/data/3.0/onecall";
  const res = await axios.get(url, {
    params: {
      appid: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
      exclude: 'minutely,hourly,alerts',
      lat: latlng.lat,
      lon: latlng.lng,
      units,
    }
  });

  return res.data;
}
