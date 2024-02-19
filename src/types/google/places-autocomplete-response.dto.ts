export interface IPlacesAutocompleteResponseDto {
  predictions: IPlaceAutocompletePrediction[];
}

export interface IPlaceAutocompletePrediction {
  description: string;
  place_id: string;
}
