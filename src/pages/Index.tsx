import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WorkDayCalculator from '@/components/WorkDayCalculator';
import CalendarView from '@/components/CalendarView';
import heroImage from '@/assets/calendar-hero.jpg';
import { Calendar, Clock, MapPin, Calculator } from 'lucide-react';

const Index = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedCity, setSelectedCity] = useState<string>('salvador');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Calculadora de Dias Úteis
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Planeje seu mês com precisão. Calcule dias úteis, feriados e horas de trabalho 
            considerando os feriados específicos da sua cidade.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Calendário Visual</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Cálculo de Horas</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Feriados por Cidade</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Work Day Calculator */}
          <WorkDayCalculator
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
          />

          {/* Calendar View */}
          <CalendarView
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedCity={selectedCity}
          />

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Como Funciona
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Nossa calculadora considera automaticamente fins de semana e feriados 
                  para determinar os dias úteis de qualquer mês.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-work-day" />
                    <span>Dias úteis são calculados excluindo sábados, domingos e feriados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-holiday" />
                    <span>Feriados nacionais e municipais são considerados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span>Horas totais são calculadas multiplicando dias úteis por horas/dia</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  Feriados por Cidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Atualmente suportamos feriados específicos para Salvador, Bahia, 
                  além dos feriados nacionais brasileiros.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Salvador, BA:</strong> Inclui São João, São Pedro, Independência da Bahia</p>
                  <p><strong>Brasil Federal:</strong> Feriados nacionais obrigatórios</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;