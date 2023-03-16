export interface IPlaceExternalApiDto {
  lat: string;
  lon: string;
  display_name: string;
}

export interface IPlaceExternalApiFetchDto {
  results?: IPlaceExternalApiResultDto[];
}

export interface IPlaceExternalApiResultDto {
  address_line1?: string;
  address_line2?: string;
  bbox?: { lon1: number; lat1: number; lon2: number; lat2: number };
  city?: string;
  country?: string;
  country_code?: string;
  county?: string;
  formatted?: string;
  lat?: number;
  lon?: number;
  name?: string;
  place_id?: string;
  postcode?: string;
  rank?: any;
  result_type?: string;
  state?: string;
  state_code?: string;
  state_district?: string;
  street?: string;
}
