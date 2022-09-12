export interface ILocationTag {
  city_limit?: string
  name?: string
  traffic_sign?: string
}

export interface ILocation {
  type?: string
  id?: number
  lat?: number
  lon?: number
  tags?: ILocationTag
}
