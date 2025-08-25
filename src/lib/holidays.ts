import { getCachedNationalHolidays } from './api';

// Fallback Brazilian federal holidays (used when API fails)
const getFallbackBrazilianHolidays = (year: number): Date[] => {
  return [
    new Date(year, 0, 1),   // New Year's Day
    new Date(year, 3, 21),  // Tiradentes
    new Date(year, 4, 1),   // Labor Day
    new Date(year, 8, 7),   // Independence Day
    new Date(year, 9, 12),  // Our Lady of Aparecida
    new Date(year, 10, 2),  // All Souls' Day
    new Date(year, 10, 15), // Proclamation of the Republic
    new Date(year, 11, 25), // Christmas Day
  ];
};

// Get Brazilian holidays from API with fallback
const getBrazilianHolidays = async (year: number): Promise<Date[]> => {
  try {
    const holidays = await getCachedNationalHolidays(year);
    return holidays.map(holiday => new Date(holiday.date));
  } catch (error) {
    console.warn('Using fallback holidays due to API error:', error);
    return getFallbackBrazilianHolidays(year);
  }
};

// Salvador-specific holidays (includes federal + local)
const getSalvadorHolidays = async (year: number): Promise<Date[]> => {
  const federalHolidays = await getBrazilianHolidays(year);
  const localHolidays = [
    new Date(year, 0, 6),   // Epiphany
    new Date(year, 5, 24),  // São João
    new Date(year, 5, 29),  // São Pedro
    new Date(year, 6, 2),   // Independence of Bahia
  ];
  return [...federalHolidays, ...localHolidays];
};

// Rio de Janeiro-specific holidays (includes federal + local)
const getRioDeJaneiroHolidays = async (year: number): Promise<Date[]> => {
  const federalHolidays = await getBrazilianHolidays(year);
  const localHolidays = [
    new Date(year, 3, 23),  // São Jorge Day
    new Date(year, 9, 17),  // Death of Zumbi dos Palmares
    new Date(year, 10, 20), // Black Awareness Day
  ];
  return [...federalHolidays, ...localHolidays];
};

// São Paulo-specific holidays (includes federal + local)
const getSaoPauloHolidays = async (year: number): Promise<Date[]> => {
  const federalHolidays = await getBrazilianHolidays(year);
  const localHolidays = [
    new Date(year, 1, 13),  // Carnival Tuesday (approximate, varies by year)
    new Date(year, 8, 9),   // Constitutionalist Revolution Day
  ];
  return [...federalHolidays, ...localHolidays];
};

// Main function to get holidays based on city
export const getCityHolidays = async (city: string, year: number): Promise<Date[]> => {
  switch (city.toLowerCase()) {
    case 'salvador':
      return await getSalvadorHolidays(year);
    case 'rio-de-janeiro':
    case 'rio':
      return await getRioDeJaneiroHolidays(year);
    case 'sao-paulo':
    case 'sp':
      return await getSaoPauloHolidays(year);
    case 'brazil':
    case 'brasil':
    default:
      return await getBrazilianHolidays(year);
  }
};

// Export individual city functions for direct access if needed
export { getBrazilianHolidays, getSalvadorHolidays, getRioDeJaneiroHolidays, getSaoPauloHolidays };