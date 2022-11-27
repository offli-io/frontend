export interface ILocationTag {
  city_limit?: string
  name?: string
  traffic_sign?: string
}

export interface ILocation {
  name?: string
  coordinates?: {
    lat?: number
    lon?: number
  }
}
