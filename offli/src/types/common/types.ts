export interface IActivityProps {
  id?: number
  name: string
  price: string
  location: string
  datetime: Date
  members: string[]
  accepted: number
  capacity: number
}

export enum ActivityRepetitionOptionsEnum {
  never = 'never',
  weekly = 'weekly',
  bi_weekly = 'bi_weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}
