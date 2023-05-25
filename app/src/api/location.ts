import axios from "axios";

export async function geolocate() {
  const url = "https://www.googleapis.com/geolocation/v1/geolocate";
  const res = await axios.post(url, {}, {
    params: {
      key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    },
  });

  return res.data.location;
}

export async function geocode(lat: number, lng: number): Promise<any[]> {
  const url = "https://maps.googleapis.com/maps/api/geocode/json";
  const res = await axios.get(url, {
    params: {
      key: import.meta.env.VITE_GOOGLE_GEOCODING_API_KEY,
      latlng: `${lat},${lng}`,
    },
  });

  return res.data.results;
}
