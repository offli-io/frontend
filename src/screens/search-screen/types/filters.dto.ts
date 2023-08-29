import { ICarouselItem } from "../../../components/mobile-carousel";

export interface IFiltersDto {
  filter?: string | null;
  date?: Date | null;
  tags?: string[];
}
