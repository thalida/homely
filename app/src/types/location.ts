export interface ILocations {
  [key: string]: ILocation
}

export interface ILocation {
  name: string
  formatted_address: string
  lat: number
  lng: number
}
