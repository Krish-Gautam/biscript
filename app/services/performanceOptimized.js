// Performance-optimized service functions with caching and error handling

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_TTL;
};

// Generic cached fetch function
export const cachedFetch = async (cacheKey, fetchFn, ttl = CACHE_TTL) => {
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    const data = await fetchFn();
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    return data;
  } catch (error) {
    console.error(`Error fetching data for key ${cacheKey}:`, error);
    throw error;
  }
};

// Clear cache function
export const clearCache = (key = null) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

// Optimized API calls with retry logic
export const apiCall = async (url, options = {}, retries = 3) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn(`API call attempt ${i + 1} failed:`, error);
      
      if (i === retries - 1) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

// Debounced function for search and input handling
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttled function for scroll and resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Resource preloading utilities
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (srcs) => {
  try {
    await Promise.all(srcs.map(preloadImage));
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${name} failed after ${end - start} milliseconds:`, error);
      throw error;
    }
  };
};

// Batch API calls for better performance
export const batchApiCalls = async (calls, batchSize = 5) => {
  const results = [];
  
  for (let i = 0; i < calls.length; i += batchSize) {
    const batch = calls.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch);
    results.push(...batchResults);
  }
  
  return results;
};

// Optimized localStorage with error handling
export const safeLocalStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('localStorage get error:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('localStorage set error:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage remove error:', error);
      return false;
    }
  }
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    return new IntersectionObserver(callback, defaultOptions);
  }
  
  return null;
};

// Request Idle Callback polyfill for better performance
export const requestIdleCallback = (callback, options = {}) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback to setTimeout
  const timeout = options.timeout || 0;
  return setTimeout(callback, timeout);
};

export const cancelIdleCallback = (id) => {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    return window.cancelIdleCallback(id);
  }
  
  return clearTimeout(id);
};

const utils = {
  cachedFetch,
  clearCache,
  apiCall,
  debounce,
  throttle,
  preloadImage,
  preloadImages,
  measurePerformance,
  batchApiCalls,
  safeLocalStorage,
  createIntersectionObserver,
  requestIdleCallback,
  cancelIdleCallback,
};

export default utils;
