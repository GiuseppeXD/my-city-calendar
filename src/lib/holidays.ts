import { getCachedNationalHolidays, Holiday, HolidayWithDate } from './api';

// Fallback Brazilian federal holidays (used when API fails)
const getFallbackBrazilianHolidays = (year: number): HolidayWithDate[] => {
  return [
    { date: `${year}-01-01`, name: 'Confraternização Universal', type: 'national', dateObject: new Date(year, 0, 1) },
    { date: `${year}-04-21`, name: 'Tiradentes', type: 'national', dateObject: new Date(year, 3, 21) },
    { date: `${year}-05-01`, name: 'Dia do Trabalho', type: 'national', dateObject: new Date(year, 4, 1) },
    { date: `${year}-09-07`, name: 'Independência do Brasil', type: 'national', dateObject: new Date(year, 8, 7) },
    { date: `${year}-10-12`, name: 'Nossa Senhora Aparecida', type: 'national', dateObject: new Date(year, 9, 12) },
    { date: `${year}-11-02`, name: 'Finados', type: 'national', dateObject: new Date(year, 10, 2) },
    { date: `${year}-11-15`, name: 'Proclamação da República', type: 'national', dateObject: new Date(year, 10, 15) },
    { date: `${year}-12-25`, name: 'Natal', type: 'national', dateObject: new Date(year, 11, 25) },
  ];
};

// Get Brazilian holidays from API with fallback
const getBrazilianHolidays = async (year: number): Promise<HolidayWithDate[]> => {
  try {
    const holidays = await getCachedNationalHolidays(year);
    return holidays.map(holiday => ({
      ...holiday,
      dateObject: new Date(holiday.date)
    }));
  } catch (error) {
    console.warn('Using fallback holidays due to API error:', error);
    return getFallbackBrazilianHolidays(year);
  }
};

// Salvador-specific holidays (includes federal + local)
const getSalvadorHolidays = async (year: number): Promise<HolidayWithDate[]> => {
  const federalHolidays = await getBrazilianHolidays(year);
  const localHolidays: HolidayWithDate[] = [
    { date: `${year}-01-06`, name: 'Epifania', type: 'city', dateObject: new Date(year, 0, 6) },
    { date: `${year}-06-24`, name: 'São João', type: 'city', dateObject: new Date(year, 5, 24) },
    { date: `${year}-06-29`, name: 'São Pedro', type: 'city', dateObject: new Date(year, 5, 29) },
    { date: `${year}-07-02`, name: 'Independência da Bahia', type: 'city', dateObject: new Date(year, 6, 2) },
  ];
  return [...federalHolidays, ...localHolidays];
};

// Rio de Janeiro-specific holidays (includes federal + local)
const getRioDeJaneiroHolidays = async (year: number): Promise<HolidayWithDate[]> => {
  const federalHolidays = await getBrazilianHolidays(year);
  const localHolidays: HolidayWithDate[] = [
    { date: `${year}-04-23`, name: 'Dia de São Jorge', type: 'city', dateObject: new Date(year, 3, 23) },
    { date: `${year}-10-17`, name: 'Morte de Zumbi dos Palmares', type: 'city', dateObject: new Date(year, 9, 17) },
    { date: `${year}-11-20`, name: 'Dia da Consciência Negra', type: 'city', dateObject: new Date(year, 10, 20) },
  ];
  return [...federalHolidays, ...localHolidays];
};

// São Paulo-specific holidays (includes federal + local)
const getSaoPauloHolidays = async (year: number): Promise<HolidayWithDate[]> => {
  const federalHolidays = await getBrazilianHolidays(year);
  const localHolidays: HolidayWithDate[] = [
    { date: `${year}-02-13`, name: 'Carnaval', type: 'city', dateObject: new Date(year, 1, 13) },
    { date: `${year}-09-09`, name: 'Revolução Constitucionalista', type: 'city', dateObject: new Date(year, 8, 9) },
  ];
  return [...federalHolidays, ...localHolidays];
};

// Main function to get holidays based on city (returns dates only for compatibility)
export const getCityHolidays = async (city: string, year: number): Promise<Date[]> => {
  const holidays = await getCityHolidaysWithNames(city, year);
  return holidays.map(holiday => holiday.dateObject);
};

// New function to get holidays with names
export const getCityHolidaysWithNames = async (city: string, year: number): Promise<HolidayWithDate[]> => {
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