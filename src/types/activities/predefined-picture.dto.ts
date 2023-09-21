export interface IPredefinedPictureResponseDto {
  pictures?: IPredefinedPictureDto[];
  count?: number;
}

export interface IPredefinedPictureDto {
  name?: string;
  tags?: string[];
}
