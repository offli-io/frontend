import { ILocation } from 'types/activities/location.dto';

export const SEARCH_RESULTS_HISTORY_KEY = 'search-results';

export const pushSearchResultIntoStorage = (searchResult: ILocation) => {
  let storageArray = [];
  // Parse the serialized data back into an aray of objects
  const foundArray = localStorage.getItem(SEARCH_RESULTS_HISTORY_KEY);
  storageArray = foundArray ? JSON.parse(foundArray) : [];
  storageArray.unshift(searchResult);
  localStorage.setItem(SEARCH_RESULTS_HISTORY_KEY, JSON.stringify(storageArray));
};

export const getHistorySearchesFromStorage = () => {
  const foundArray = localStorage.getItem(SEARCH_RESULTS_HISTORY_KEY);
  return foundArray ? JSON.parse(foundArray) : [];
};
