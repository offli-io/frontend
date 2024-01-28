export const ACTIVITY_SCROLL_POSITION = 'activity-scroll-position';

export const setScrollOffset = (offset?: number | null) => {
  if (!offset) {
    localStorage.removeItem(ACTIVITY_SCROLL_POSITION);
  }
  localStorage.setItem(ACTIVITY_SCROLL_POSITION, String(offset));
};

export const getScrollOffset = (): string | null => {
  const scrollOffset = localStorage.getItem(ACTIVITY_SCROLL_POSITION);
  return scrollOffset ? JSON.parse(scrollOffset) : null;
};
