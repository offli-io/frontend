import { ICarouselItem } from "../../../components/mobile-carousel";

export interface IFiltersDto {
  filter?: string;
  date?: ICarouselItem;
  tags?: string[];
}
