const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

export const getFromCache = (key) => {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() - item.timestamp > CACHE_EXPIRY) {
    cache.delete(key);
    return null;
  }

  return item.data;
};

export const setToCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};
