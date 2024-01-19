export interface IUserStatisticsDto {
  activities_created_last_month_count: number;
  activities_participated_last_month_count: number;
  creator_feedback: number;
  enjoyed_together_last_month_count: number;
  new_buddies_last_month_count: number;
}

export interface IFeedbackAlreadySentByUserDto {
  is_submitted: boolean;
  feedback: {
    sender_id?: number;
    activity_id?: number;
    value?: number;
  };
}
