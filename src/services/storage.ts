import { SavedSearch } from '../types/wiki';

const STORAGE_KEY = 'wiki_searches';

export const saveSearch = (search: SavedSearch): void => {
  const savedSearches = getSavedSearches();
  savedSearches.push(search);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSearches));
};

export const getSavedSearches = (): SavedSearch[] => {
  const searches = localStorage.getItem(STORAGE_KEY);
  return searches ? JSON.parse(searches) : [];
};

export const clearSavedSearches = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};