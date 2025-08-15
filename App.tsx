import React, { useState, useCallback } from 'react';
import { UI_STRINGS } from './constants';
import { calculateOnaDates } from './utils/calendar';
import type { CalculationResult, CalendarType, DateParts } from './types';
import Header from './components/Header';
import DateInputGroup from './components/DateInputGroup';
import ResultCard from './components/ResultCard';

const toPersianNumber = (n: number | string): string => {
  if (n === undefined || n === null) return '';
  return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

const initialDate: DateParts = { year: null, month: null, day: null };

export default function App(): React.ReactNode {
  const [calendarType, setCalendarType] = useState<CalendarType>('shamsi');
  const [lastPeriod, setLastPeriod] = useState<DateParts>(initialDate);
  const [prevPeriod, setPrevPeriod] = useState<DateParts>(initialDate);
  
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = useCallback(() => {
    setError('');
    setResults(null);

    // This preliminary check provides fast feedback for incomplete forms.
    if (!lastPeriod.year || !lastPeriod.month || !lastPeriod.day || !prevPeriod.year || !prevPeriod.month || !prevPeriod.day) {
      setError(UI_STRINGS.invalidDateError);
      return;
    }

    const { result, error: calcError } = calculateOnaDates(lastPeriod, prevPeriod, calendarType);

    if (result) {
      setResults(result);
    } else if (calcError === 'date_order') {
      setError(UI_STRINGS.dateOrderError);
    } else if (calcError === 'invalid_date') {
      // This catches cases like "31 Farvardin" which are structurally complete but logically invalid.
      setError(UI_STRINGS.invalidDateError);
    } else {
        // Fallback for any other unexpected issues
        setError("یک خطای ناشناخته در محاسبه رخ داد. لطفا ورودی خود را بررسی کنید.");
    }
  }, [lastPeriod, prevPeriod, calendarType]);

  const handleCalendarChange = (type: CalendarType) => {
    setCalendarType(type);
    setLastPeriod(initialDate);
    setPrevPeriod(initialDate);
    setResults(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div 
        className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex flex-col items-center p-4 sm:p-6 lg:p-8"
      >
        <div className="w-full max-w-5xl mx-auto">
          <Header />
          
          <main className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
              
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-700 mb-4">{UI_STRINGS.subtitle}</h2>
                <DateInputGroup 
                  calendarType={calendarType}
                  onCalendarTypeChange={handleCalendarChange}
                  lastPeriod={lastPeriod}
                  onLastPeriodChange={setLastPeriod}
                  prevPeriod={prevPeriod}
                  onPrevPeriodChange={setPrevPeriod}
                />
                 <button 
                    onClick={handleCalculate}
                    className="w-full mt-8 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform hover:scale-105"
                >
                    {UI_STRINGS.calculateButton}
                </button>
                {error && (
                    <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg mt-4 text-center">{error}</p>
                )}
              </div>

              <div className="mt-8 lg:mt-0 lg:border-r lg:border-gray-200 lg:pr-12">
                <h2 className="text-xl font-bold text-gray-700 mb-4">{UI_STRINGS.resultsTitle}</h2>
                {results ? (
                  <div className="space-y-4">
                    <ResultCard
                      title={UI_STRINGS.onaBeinonitTitle}
                      date={results.onaBeinonit}
                      description={UI_STRINGS.onaBeinonitDescription}
                    />
                    <ResultCard
                      title={UI_STRINGS.yomHaflagaTitle}
                      date={results.yomHaflaga}
                      description={UI_STRINGS.yomHaflagaDescription(toPersianNumber(results.interval))}
                    />
                    <ResultCard
                      title={UI_STRINGS.vesetHachodeshTitle}
                      date={results.vesetHachodesh}
                      description={UI_STRINGS.vesetHachodeshDescription}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                    <p>{error ? '' : UI_STRINGS.waitingForInput}</p>
                  </div>
                )}
              </div>

            </div>
          </main>
           <footer className="text-center mt-8 text-sm text-gray-500">
            <p>ساخته شده با ❤️</p>
          </footer>
        </div>
      </div>
    </div>
  );
}