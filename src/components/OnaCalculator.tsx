import React, { useState, useEffect } from 'react';
import { CalendarType, DateParts, CalculationResult } from '../../types';
import { UI_STRINGS } from '../../constants';
import { calculateOnaDates } from '../../utils/calendar';
import { getHebrewDefaultDates } from '../utils/hebrewDefaults';
import Header from '../../components/Header';
import DateInputGroup from '../../components/DateInputGroup';
import ResultCard from '../../components/ResultCard';

const OnaCalculator: React.FC = () => {
  const [calendarType, setCalendarType] = useState<CalendarType>('hebrew');
  const [lastPeriod, setLastPeriod] = useState<DateParts>({ year: null, month: null, day: null });
  const [prevPeriod, setPrevPeriod] = useState<DateParts>({ year: null, month: null, day: null });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set Hebrew default dates when component mounts or calendar type changes to Hebrew
  useEffect(() => {
    if (calendarType === 'hebrew') {
      const defaults = getHebrewDefaultDates();
      setLastPeriod(defaults.lastPeriod);
      setPrevPeriod(defaults.prevPeriod);
    } else {
      // Reset for shamsi calendar
      setLastPeriod({ year: null, month: null, day: null });
      setPrevPeriod({ year: null, month: null, day: null });
    }
  }, [calendarType]);

  const handleCalculate = () => {
    const calculation = calculateOnaDates(lastPeriod, prevPeriod, calendarType);
    
    if (calculation.error === 'invalid_date') {
      setError(UI_STRINGS.invalidDateError);
      setResult(null);
    } else if (calculation.error === 'date_order') {
      setError(UI_STRINGS.dateOrderError);
      setResult(null);
    } else {
      setError(null);
      setResult(calculation.result);
    }
  };

  const hasValidInput = lastPeriod.year && lastPeriod.month && lastPeriod.day &&
                       prevPeriod.year && prevPeriod.month && prevPeriod.day;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <DateInputGroup
            calendarType={calendarType}
            onCalendarTypeChange={setCalendarType}
            lastPeriod={lastPeriod}
            onLastPeriodChange={setLastPeriod}
            prevPeriod={prevPeriod}
            onPrevPeriodChange={setPrevPeriod}
          />

          <div className="flex justify-center">
            <button
              onClick={handleCalculate}
              disabled={!hasValidInput}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {UI_STRINGS.calculateButton}
            </button>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">{UI_STRINGS.resultsTitle}</h2>
            
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center">
                {error}
              </div>
            )}
            
            {!result && !error && (
              <div className="p-4 bg-muted rounded-lg text-muted-foreground text-center">
                {UI_STRINGS.waitingForInput}
              </div>
            )}
            
            {result && (
              <div className="grid gap-6 md:grid-cols-3">
                <ResultCard
                  title={UI_STRINGS.onaBeinonitTitle}
                  description={UI_STRINGS.onaBeinonitDescription}
                  date={result.onaBeinonit}
                />
                <ResultCard
                  title={UI_STRINGS.yomHaflagaTitle}
                  description={UI_STRINGS.yomHaflagaDescription(result.interval.toString())}
                  date={result.yomHaflaga}
                />
                <ResultCard
                  title={UI_STRINGS.vesetHachodeshTitle}
                  description={UI_STRINGS.vesetHachodeshDescription}
                  date={result.vesetHachodesh}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnaCalculator;