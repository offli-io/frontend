import { TabDefinitionsEnum } from './tab-definitions';

export const SWIPE_ARRAY_ORDER = [
  TabDefinitionsEnum.UPCOMING,
  TabDefinitionsEnum.PAST,
  TabDefinitionsEnum.INVITED,
  TabDefinitionsEnum.CREATED
];

export const detectSwipedTab = (
  swipeDirection: 'left' | 'right',
  currentTab: TabDefinitionsEnum
) => {
  if (
    (currentTab === TabDefinitionsEnum.UPCOMING && swipeDirection === 'right') ||
    (currentTab === TabDefinitionsEnum.CREATED && swipeDirection === 'left')
  ) {
    return currentTab;
  }
  const currentTabIndex = SWIPE_ARRAY_ORDER.findIndex((item) => item === currentTab);
  if (swipeDirection === 'left') {
    return SWIPE_ARRAY_ORDER[currentTabIndex + 1];
  }
  if (swipeDirection === 'right') {
    return SWIPE_ARRAY_ORDER[currentTabIndex - 1];
  }

  //fallback
  return currentTab;
};
