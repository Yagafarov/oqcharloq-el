import { useState, useEffect, useCallback } from 'react';
import { debounce } from '../utils/helpers';
import { SEARCH_DEBOUNCE_TIME } from '../utils/constants';

/**
 * Custom hook for search functionality with debounce
 */
export const useSearch = (onSearch, debounceTime = SEARCH_DEBOUNCE_TIME) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      setDebouncedTerm(term);
    }, debounceTime),
    [debounceTime]
  );

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedTerm('');
  };

  // Effect to call onSearch when debounced term changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedTerm);
    }
  }, [debouncedTerm, onSearch]);

  return {
    searchTerm,
    debouncedTerm,
    handleSearchChange,
    clearSearch,
    isSearching: searchTerm !== debouncedTerm
  };
};
