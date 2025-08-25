import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock, MapPin, Calculator } from 'lucide-react';
import { format, getDaysInMonth, eachDayOfInterval, startOfMonth, endOfMonth, isWeekend, isSameDay } from 'date-fns';
import { getCityHolidays } from '@/lib/holidays';
import { MONTHS, DAY_NAMES } from '@/lib/constants';

interface WorkDayCalculatorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const WorkDayCalculator: React.FC<WorkDayCalculatorProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  selectedCity,
  onCityChange,
}) => {
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const workDayStats = useMemo(() => {
    const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
    const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth));
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const holidays = getCityHolidays(selectedCity, selectedYear);

    let workDays = 0;
    let weekendDays = 0;
    let holidayDays = 0;

    daysInMonth.forEach(day => {
      const isHoliday = holidays.some(holiday => isSameDay(day, holiday));
      const isWeekendDay = isWeekend(day);

      if (isHoliday) {
        holidayDays++;
      } else if (isWeekendDay) {
        weekendDays++;
      } else {
        workDays++;
      }
    });

    return {
      totalDays: daysInMonth.length,
      workDays,
      weekendDays,
      holidayDays,
      totalWorkHours: workDays * hoursPerDay,
      holidays: holidays.filter(holiday => 
        holiday.getMonth() === selectedMonth && holiday.getFullYear() === selectedYear
      ),
    };
  }, [selectedMonth, selectedYear, hoursPerDay, selectedCity]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadora de Dias Úteis
          </CardTitle>
          <CardDescription>
            Configure o mês, cidade e horas por dia para calcular seus dias úteis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Month Selector */}
            <div className="space-y-2">
              <Label htmlFor="month">Mês</Label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Selector */}
            <div className="space-y-2">
              <Label htmlFor="year">Ano</Label>
              <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Selector */}
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Cidade
              </Label>
              <Select value={selectedCity} onValueChange={onCityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salvador">Salvador, BA</SelectItem>
                  <SelectItem value="rio-de-janeiro">Rio de Janeiro, RJ</SelectItem>
                  <SelectItem value="sao-paulo">São Paulo, SP</SelectItem>
                  <SelectItem value="brazil">Brasil (Federal)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hours per day */}
          <div className="space-y-2">
            <Label htmlFor="hours" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Horas por dia útil
            </Label>
            <Input
              id="hours"
              type="number"
              min="1"
              max="12"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(parseFloat(e.target.value) || 8)}
              className="max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{workDayStats.totalDays}</div>
              <p className="text-sm text-muted-foreground">Total de Dias</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-work-day flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-work-day-foreground" />
              </div>
              <div className="text-2xl font-bold text-work-day">{workDayStats.workDays}</div>
              <p className="text-sm text-muted-foreground">Dias Úteis</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-holiday flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-holiday-foreground" />
              </div>
              <div className="text-2xl font-bold text-holiday">{workDayStats.holidayDays}</div>
              <p className="text-sm text-muted-foreground">Feriados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-accent">{workDayStats.totalWorkHours}</div>
              <p className="text-sm text-muted-foreground">Horas Úteis</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holiday List */}
      {workDayStats.holidays.length > 0 && (
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Feriados em {MONTHS[selectedMonth]} {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workDayStats.holidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-md bg-holiday/10">
                  <span className="font-medium">{format(holiday, 'dd/MM/yyyy')}</span>
                  <span className="text-sm text-muted-foreground">
                    {DAY_NAMES[holiday.getDay()]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkDayCalculator;