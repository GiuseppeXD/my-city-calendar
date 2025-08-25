// Brazilian federal holidays
const getBrazilianHolidays = (year: number): Date[] => {
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

// Salvador-specific holidays (includes federal + local)
const getSalvadorHolidays = (year: number): Date[] => {
  return [
    ...getBrazilianHolidays(year),
    new Date(year, 0, 6),   // Epiphany
    new Date(year, 5, 24),  // São João
    new Date(year, 5, 29),  // São Pedro
    new Date(year, 6, 2),   // Independence of Bahia
  ];
};

// Rio de Janeiro-specific holidays (includes federal + local)
const getRioDeJaneiroHolidays = (year: number): Date[] => {
  return [
    ...getBrazilianHolidays(year),
    new Date(year, 3, 23),  // São Jorge Day
    new Date(year, 9, 17),  // Death of Zumbi dos Palmares
    new Date(year, 10, 20), // Black Awareness Day
  ];
};

// São Paulo-specific holidays (includes federal + local)
const getSaoPauloHolidays = (year: number): Date[] => {
  return [
    ...getBrazilianHolidays(year),
    new Date(year, 1, 13),  // Carnival Tuesday (approximate, varies by year)
    new Date(year, 8, 9),   // Constitutionalist Revolution Day
  ];
};

// Main function to get holidays based on city
export const getCityHolidays = (city: string, year: number): Date[] => {
  switch (city.toLowerCase()) {
    case 'salvador':
      return getSalvadorHolidays(year);
    case 'rio-de-janeiro':
    case 'rio':
      return getRioDeJaneiroHolidays(year);
    case 'sao-paulo':
    case 'sp':
      return getSaoPauloHolidays(year);
    case 'brazil':
    case 'brasil':
    default:
      return getBrazilianHolidays(year);
  }
};

// Export individual city functions for direct access if needed
export { getBrazilianHolidays, getSalvadorHolidays, getRioDeJaneiroHolidays, getSaoPauloHolidays };