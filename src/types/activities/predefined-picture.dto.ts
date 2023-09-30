export interface IPredefinedPictureResponseDto {
  pictures?: IPredefinedPictureDto[];
  count?: number;
}

export interface IPredefinedPictureDto {
  url?: string;
  tags?: string[];
}
