import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek,
  isSameMonth, 
  isToday, 
  isWeekend, 
  isSameDay 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Brazilian federal holidays and Salvador-specific holidays
const getBrazilianHolidays = (year: number) => {
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

const getSalvadorHolidays = (year: number) => {
  return [
    ...getBrazilianHolidays(year),
    new Date(year, 0, 6),   // Epiphany
    new Date(year, 5, 24),  // São João
    new Date(year, 5, 29),  // São Pedro
    new Date(year, 6, 2),   // Independence of Bahia
  ];
};

interface CalendarViewProps {
  selectedMonth: number;
  selectedYear: number;
  selectedCity: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedMonth,
  selectedYear,
  selectedCity = 'salvador',
}) => {
  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
    const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth));
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const holidays = selectedCity === 'salvador' 
      ? getSalvadorHolidays(selectedYear)
      : getBrazilianHolidays(selectedYear);

    return {
      days,
      holidays,
      monthStart,
      monthEnd
    };
  }, [selectedMonth, selectedYear, selectedCity]);

  const getDayType = (day: Date) => {
    const isCurrentMonth = isSameMonth(day, calendarData.monthStart);
    const isTodayDate = isToday(day);
    const isWeekendDay = isWeekend(day);
    const isHoliday = calendarData.holidays.some(holiday => isSameDay(day, holiday));

    if (!isCurrentMonth) return 'other-month';
    if (isTodayDate) return 'today';
    if (isHoliday) return 'holiday';
    if (isWeekendDay) return 'weekend';
    return 'work-day';
  };

  const getDayStyles = (dayType: string) => {
    const baseStyles = "w-full h-12 flex items-center justify-center text-sm font-medium rounded-md transition-all duration-200 hover:scale-105";
    
    switch (dayType) {
      case 'today':
        return cn(baseStyles, "bg-today text-today-foreground shadow-md ring-2 ring-today/50");
      case 'work-day':
        return cn(baseStyles, "bg-work-day text-work-day-foreground hover:bg-work-day/90");
      case 'holiday':
        return cn(baseStyles, "bg-holiday text-holiday-foreground hover:bg-holiday/90");
      case 'weekend':
        return cn(baseStyles, "bg-weekend text-weekend-foreground hover:bg-weekend/80");
      case 'other-month':
        return cn(baseStyles, "text-muted-foreground/50 hover:text-muted-foreground/70");
      default:
        return cn(baseStyles, "hover:bg-muted");
    }
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <Card className="bg-gradient-card shadow-elevated">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-2xl">
          {format(new Date(selectedYear, selectedMonth), 'MMMM yyyy', { locale: ptBR })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="h-10 flex items-center justify-center text-sm font-semibold text-muted-foreground bg-muted/50 rounded-md"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarData.days.map((day, index) => {
            const dayType = getDayType(day);
            const dayNumber = format(day, 'd');
            
            return (
              <div key={index} className={getDayStyles(dayType)}>
                <span>{dayNumber}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Badge variant="outline" className="bg-work-day/20 text-work-day border-work-day/30">
            Dia Útil
          </Badge>
          <Badge variant="outline" className="bg-weekend/20 text-weekend border-weekend/30">
            Final de Semana
          </Badge>
          <Badge variant="outline" className="bg-holiday/20 text-holiday border-holiday/30">
            Feriado
          </Badge>
          <Badge variant="outline" className="bg-today/20 text-today border-today/30">
            Hoje
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;