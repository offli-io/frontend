export enum RadioGroupDataDefinitionsEnum {
  NEAREST = 'Nearest',
  CLOSEST_TIME = 'Closest time',
  HIGHEST_ATTENDANCE = 'Highest attendance',
  CHEAPEST = 'Cheapest'
}

export const RadioLabelToFilterValue: { [key: string]: string } = {
  [RadioGroupDataDefinitionsEnum.NEAREST]: 'nearest',
  [RadioGroupDataDefinitionsEnum.CHEAPEST]: 'cheapest',
  [RadioGroupDataDefinitionsEnum.HIGHEST_ATTENDANCE]: 'popular',
  [RadioGroupDataDefinitionsEnum.CLOSEST_TIME]: 'recent'
};
