export interface IActivitiesParamsDto {
  id?: number;
  text?: string;
  tag?: string[];
  datetimeFrom?: Date | null;
  limit?: number;
  offset?: number;
  lon?: number;
  lat?: number;
  participantId?: number;
}
