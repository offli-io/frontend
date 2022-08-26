export interface IPerson {
  id: string
  name: string
  username: string
  profile_photo: string
}

export interface IActivityLocation {
  name: string
  coordinates: number[]
}

export interface IActivityLimit {
  activated: boolean
  max_participants: number
}

export interface IActivity {
  id: string
  participants: IPerson[]
  title: string
  description: string
  title_picture: string
  creator: IPerson[]
  datetime: Date | string
  location: IActivityLocation
  tags: string[]
  //TODO mozne nejake enumy na "public/private"
  visibility: string
  limit: IActivityLimit
}

export interface IActivitySearchParams {
  limit: number
  offset: number
  long: number
  lat: number
  tag: string[]
}
