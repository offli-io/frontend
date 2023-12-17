import { add, format } from 'date-fns';
import { ICarouselItem } from '../../../components/mobile-carousel';

//todo oursource into util functions
export const generateDateSlots: (isFirstSelected?: boolean) => ICarouselItem[] = (
  isFirstSelected?: boolean
) => {
  const dateSlots = [] as ICarouselItem[];
  for (let i = 0; i < 5; i++) {
    const date = add(new Date(), {
      days: i
    });
    dateSlots.push({
      dateValue: date,
      title: format(date, 'EEEE').slice(0, 3),
      description: format(date, 'dd.MM.yyyy'),
      disabled: false,
      selected: isFirstSelected ? i === 0 : false,
      id: `date_slot_${format(date, 'dd.MM.yyyy')}`
    });
  }
  return dateSlots;
};
