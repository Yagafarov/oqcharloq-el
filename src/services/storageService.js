/**
 * LocalStorage wrapper service
 * Provides safe and convenient methods for working with localStorage
 */

/**
 * Get item from localStorage
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    
    if (item === null) {
      return defaultValue;
    }
    
    // Try to parse JSON
    try {
      return JSON.parse(item);
    } catch {
      // Return as string if not JSON
      return item;
    }
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage
 */
export const setItem = (key, value) => {
  try {
    const serializedValue = typeof value === 'string' 
      ? value 
      : JSON.stringify(value);
    
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
    
    // Check if quota exceeded
    if (error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded');
    }
    
    return false;
  }
};

/**
 * Remove item from localStorage
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clear all items from localStorage
 */
export const clear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if key exists in localStorage
 */
export const hasItem = (key) => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking item ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Get all keys from localStorage
 */
export const getAllKeys = () => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting all keys from localStorage:', error);
    return [];
  }
};

/**
 * Get localStorage size in bytes
 */
export const getSize = () => {
  try {
    let total = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    
    return total;
  } catch (error) {
    console.error('Error calculating localStorage size:', error);
    return 0;
  }
};

/**
 * Get localStorage size in MB
 */
export const getSizeInMB = () => {
  const bytes = getSize();
  return (bytes / 1024 / 1024).toFixed(2);
};

/**
 * Check if localStorage is available
 */
export const isAvailable = () => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get multiple items from localStorage
 */
export const getMultiple = (keys) => {
  const result = {};
  
  keys.forEach(key => {
    result[key] = getItem(key);
  });
  
  return result;
};

/**
 * Set multiple items in localStorage
 */
export const setMultiple = (items) => {
  try {
    Object.entries(items).forEach(([key, value]) => {
      setItem(key, value);
    });
    return true;
  } catch (error) {
    console.error('Error setting multiple items in localStorage:', error);
    return false;
  }
};

/**
 * Remove multiple items from localStorage
 */
export const removeMultiple = (keys) => {
  try {
    keys.forEach(key => {
      removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error removing multiple items from localStorage:', error);
    return false;
  }
};

/**
 * Get items by prefix
 */
export const getByPrefix = (prefix) => {
  const result = {};
  
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        result[key] = getItem(key);
      }
    });
    
    return result;
  } catch (error) {
    console.error(`Error getting items by prefix ${prefix}:`, error);
    return result;
  }
};

/**
 * Remove items by prefix
 */
export const removeByPrefix = (prefix) => {
  try {
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith(prefix)
    );
    
    keysToRemove.forEach(key => {
      removeItem(key);
    });
    
    return true;
  } catch (error) {
    console.error(`Error removing items by prefix ${prefix}:`, error);
    return false;
  }
};

/**
 * Export all localStorage data
 */
export const exportData = () => {
  try {
    const data = {};
    
    Object.keys(localStorage).forEach(key => {
      data[key] = getItem(key);
    });
    
    return data;
  } catch (error) {
    console.error('Error exporting localStorage data:', error);
    return {};
  }
};

/**
 * Import data to localStorage
 */
export const importData = (data) => {
  try {
    Object.entries(data).forEach(([key, value]) => {
      setItem(key, value);
    });
    return true;
  } catch (error) {
    console.error('Error importing data to localStorage:', error);
    return false;
  }
};

// Default export
export default {
  getItem,
  setItem,
  removeItem,
  clear,
  hasItem,
  getAllKeys,
  getSize,
  getSizeInMB,
  isAvailable,
  getMultiple,
  setMultiple,
  removeMultiple,
  getByPrefix,
  removeByPrefix,
  exportData,
  importData
};
