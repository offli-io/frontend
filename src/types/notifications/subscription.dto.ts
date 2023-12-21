export interface ISubscriptionDto {
  user_id?: number; // Ignored by BE during PUT request
  devices?: ISubscriptionDeviceDto[]; // Ignored by BE during PUT request
  permission_map: {
    activity_inv: boolean;
    activity_change: boolean;
    buddy_req: boolean;
  };
}

export interface ISubscriptionDeviceDto {
  id?: number; // Ignored by BE during PUT request
  name: string;
  endpoint: string;
  auth: string;
  p256dh: string;
}
