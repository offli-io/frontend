import { IActivity, IPerson } from '../activities/activity.dto'
import { NotificationTypeEnum } from './notification-type-enum'

export interface INotificationDto {
  id: number
  user_id: string
  seen: boolean
  type: NotificationTypeEnum
  timestamp: number
  message: string
  properties: {
    activity?: IActivity
    user?: IPerson
  }
}
