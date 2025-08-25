export interface Holiday {
  date: string;
  name: string;
  type: 'national' | 'state' | 'city';
}

export interface BrasilAPIHoliday {
  date: string;
  name: string;
  type: string;
}

const BRASIL_API_BASE_URL = 'https://brasilapi.com.br/api/feriados/v1';

export const fetchNationalHolidays = async (year: number): Promise<Holiday[]> => {
  try {
    const response = await fetch(`${BRASIL_API_BASE_URL}/${year}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch holidays: ${response.status}`);
    }
    
    const data: BrasilAPIHoliday[] = await response.json();
    
    return data.map(holiday => ({
      date: holiday.date,
      name: holiday.name,
      type: 'national' as const
    }));
  } catch (error) {
    console.error('Error fetching holidays from BrasilAPI:', error);
    throw error;
  }
};

// Cache for API responses to avoid repeated calls
const holidayCache = new Map<number, Holiday[]>();

export const getCachedNationalHolidays = async (year: number): Promise<Holiday[]> => {
  if (holidayCache.has(year)) {
    return holidayCache.get(year)!;
  }
  
  try {
    const holidays = await fetchNationalHolidays(year);
    holidayCache.set(year, holidays);
    return holidays;
  } catch (error) {
    // Return empty array if API fails, components should handle fallback
    return [];
  }
};