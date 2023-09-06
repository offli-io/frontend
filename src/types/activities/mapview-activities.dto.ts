export interface IMapViewActivitiesResponseDto {
  activities: IMapViewActivityDto[];
  count: number;
}

export interface IMapViewActivityDto {
  id: number;
  lat: number;
  lon: number;
}
