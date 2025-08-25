import React, { useMemo, useEffect, useState } from 'react';
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
import { getHolidayDates } from '@/lib/holidayService';
import { WEEK_DAYS } from '@/lib/constants';

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
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState<boolean>(false);

  // Fetch holidays when city or year changes
  useEffect(() => {
    const fetchHolidays = async () => {
      setIsLoadingHolidays(true);
      try {
        const cityHolidays = await getHolidayDates(selectedCity, selectedYear);
        setHolidays(cityHolidays);
      } catch (error) {
        console.error('Error fetching holidays:', error);
        setHolidays([]); // Fallback to empty array
      } finally {
        setIsLoadingHolidays(false);
      }
    };

    fetchHolidays();
  }, [selectedCity, selectedYear]);
  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
    const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth));
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return {
      days,
      holidays,
      monthStart,
      monthEnd
    };
  }, [selectedMonth, selectedYear, holidays]);

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


  return (
    <Card className="bg-gradient-card shadow-elevated">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
          {format(new Date(selectedYear, selectedMonth), 'MMMM yyyy', { locale: ptBR })}
          {isLoadingHolidays && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Week day headers */}
          {WEEK_DAYS.map((day) => (
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