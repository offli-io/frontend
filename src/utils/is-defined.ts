export const isDefined = (query?: string | number | null) => {
  // should cover null, undefined, empty string ("") or 0
  return !!query;
};
