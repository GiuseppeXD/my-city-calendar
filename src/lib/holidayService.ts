// Centralized holiday service to avoid duplicate API calls
import { HolidayWithDate } from './api';
import { getCityHolidaysWithNames } from './holidays';

// Global cache for holiday data
const holidayCache = new Map<string, {
  data: HolidayWithDate[];
  timestamp: number;
}>();

// Cache duration: 1 hour
const CACHE_DURATION = 60 * 60 * 1000;

// Active requests to prevent duplicate API calls
const activeRequests = new Map<string, Promise<HolidayWithDate[]>>();

export const getHolidays = async (city: string, year: number): Promise<HolidayWithDate[]> => {
  const cacheKey = `${city}-${year}`;
  const now = Date.now();
  
  // Check cache first
  const cached = holidayCache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log(`[HolidayService] Cache hit for ${cacheKey}`);
    return cached.data;
  }
  
  // Check if request is already in progress
  if (activeRequests.has(cacheKey)) {
    console.log(`[HolidayService] Request in progress for ${cacheKey}, waiting...`);
    return await activeRequests.get(cacheKey)!;
  }
  
  // Make new request
  console.log(`[HolidayService] Fetching holidays for ${cacheKey}`);
  const requestPromise = getCityHolidaysWithNames(city, year);
  activeRequests.set(cacheKey, requestPromise);
  
  try {
    const holidays = await requestPromise;
    
    // Cache the result
    holidayCache.set(cacheKey, {
      data: holidays,
      timestamp: now
    });
    
    console.log(`[HolidayService] Cached ${holidays.length} holidays for ${cacheKey}`);
    return holidays;
    
  } finally {
    // Remove from active requests
    activeRequests.delete(cacheKey);
  }
};

// Get only Date objects (for compatibility with existing calendar logic)
export const getHolidayDates = async (city: string, year: number): Promise<Date[]> => {
  const holidays = await getHolidays(city, year);
  return holidays.map(h => h.dateObject);
};

// Clear cache (useful for debugging or manual refresh)
export const clearHolidayCache = () => {
  holidayCache.clear();
  activeRequests.clear();
  console.log('[HolidayService] Cache cleared');
};