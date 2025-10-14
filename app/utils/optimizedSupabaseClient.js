// lib/optimizedSupabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Always available (anon key) – safe for frontend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only available in server env (service role key)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Auto-pick key based on environment
const isServer = typeof window === 'undefined'
const supabaseKey = isServer && supabaseServiceRoleKey
  ? supabaseServiceRoleKey
  : supabaseAnonKey

// Cache for storing frequently accessed data
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache entry is valid
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_TTL;
};

// Optimized Supabase client with caching
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Cached data fetching functions
export const cachedQuery = async (queryKey, queryFn, ttl = CACHE_TTL) => {
  // Check cache first
  const cached = cache.get(queryKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  // Fetch fresh data
  try {
    const data = await queryFn();
    cache.set(queryKey, {
      data,
      timestamp: Date.now()
    });
    return data;
  } catch (error) {
    console.error(`Error fetching data for key ${queryKey}:`, error);
    throw error;
  }
};

// Clear cache function
export const clearCache = (queryKey = null) => {
  if (queryKey) {
    cache.delete(queryKey);
  } else {
    cache.clear();
  }
};

// Cache invalidation based on table changes
export const setupCacheInvalidation = () => {
  if (typeof window === 'undefined') return;

  supabase
    .channel('cache-invalidation')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles'
      },
      () => {
        // Clear profile-related cache
        clearCache('userProfile');
        clearCache('userChallenges');
        clearCache('userBadges');
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'challenges'
      },
      () => {
        // Clear challenge-related cache
        clearCache('challenges');
        clearCache('userChallenges');
      }
    )
    .subscribe();
};

// Optimized auth functions with caching
export const getCachedSession = async () => {
  return cachedQuery('session', async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }, 10000); // Cache session for 10 seconds
};

export const getCachedUser = async () => {
  const session = await getCachedSession();
  if (!session) return null;
  
  return cachedQuery(`user-${session.user.id}`, async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  });
};

// Preload critical data
export const preloadCriticalData = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Preload user session
    await getCachedSession();
    
    // Preload user profile if authenticated
    const session = await getCachedSession();
    if (session) {
      await getCachedUser();
    }
  } catch (error) {
    console.error('Error preloading critical data:', error);
  }
};

export default supabase;
