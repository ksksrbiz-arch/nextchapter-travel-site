const { getRedisClient } = require('../config/redis');

// Cache middleware
exports.cache = (duration = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const redisClient = getRedisClient();
    
    // If Redis is not connected, skip caching
    if (!redisClient || !redisClient.isReady) {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redisClient.get(key);
      
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache response
      res.json = (data) => {
        redisClient.setEx(key, duration, JSON.stringify(data));
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

// Clear cache by pattern
exports.clearCache = async (pattern) => {
  const redisClient = getRedisClient();
  
  if (!redisClient || !redisClient.isReady) {
    return false;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Clear cache error:', error);
    return false;
  }
};

// Clear all cache
exports.clearAllCache = async () => {
  const redisClient = getRedisClient();
  
  if (!redisClient || !redisClient.isReady) {
    return false;
  }

  try {
    await redisClient.flushDb();
    return true;
  } catch (error) {
    console.error('Clear all cache error:', error);
    return false;
  }
};
