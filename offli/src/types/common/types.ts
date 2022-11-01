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

export enum ActivityFeesOptionsEnum {
  free = 'free',
  from1to15 = '1-15',
  from16to30 = '16-30',
  from31to45 = '31-45',
  from46to60 = '46-60',
  from61to75 = '61-75',
  more = 'more than 100',
}
