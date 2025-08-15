import React, { useMemo, useState, useEffect } from 'react';
import jalaali from 'jalaali-js';
import { UI_STRINGS, SHAMSI_MONTHS_PERSIAN, HEBREW_MONTHS_PERSIAN, HEBREW_MONTHS_ENGLISH_LEAP, HEBREW_MONTHS_ENGLISH } from '../constants';
import type { CalendarType, DateParts } from '../types';
import { getEquivalentDateDisplay } from '../utils/calendar';

declare const hebcal: any;

interface DatePickerSelectProps {
  label: string;
  calendarType: CalendarType;
  value: DateParts;
  onChange: (parts: DateParts) => void;
}

const toPersianNumber = (n: number | string): string => {
  return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

const selectBaseClass = "block w-full px-3 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-shadow disabled:bg-gray-100 disabled:cursor-not-allowed";

export default function DatePickerSelect({ label, calendarType, value, onChange }: DatePickerSelectProps): React.ReactNode {
  const { year, month, day } = value;
  const [equivalentDate, setEquivalentDate] = useState<string | null>(null);

  const currentYear = useMemo(() => {
    if (typeof hebcal === 'undefined' || typeof jalaali.toJalaali === 'undefined') {
        const d = new Date();
        return calendarType === 'shamsi' ? d.getFullYear() - 621 : d.getFullYear() + 3760;
    }
    const today = new Date();
    return calendarType === 'shamsi' ? jalaali.toJalaali(today).jy : new hebcal.HDate(today).year;
  }, [calendarType]);
  
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const months = useMemo(() => {
    if (calendarType === 'shamsi') {
      return SHAMSI_MONTHS_PERSIAN.map((name, index) => ({ value: index + 1, name }));
    } 
    if (typeof hebcal === 'undefined') {
        return HEBREW_MONTHS_ENGLISH.map((name, index) => ({
             value: index + 1,
             name: HEBREW_MONTHS_PERSIAN[name] || name
        }));
    }
    const isLeap = year ? hebcal.HDate.isLeapYear(year) : hebcal.HDate.isLeapYear(currentYear);
    const monthNames = isLeap ? HEBREW_MONTHS_ENGLISH_LEAP : HEBREW_MONTHS_ENGLISH;
    return monthNames.map((name, index) => ({
        value: index + 1,
        name: HEBREW_MONTHS_PERSIAN[name] || name,
    }));
  }, [calendarType, year, currentYear]);

  const daysInMonth = useMemo(() => {
    if (!year || !month) return 31; 
    
    if (calendarType === 'shamsi') {
      try {
        return jalaali.jalaaliMonthLength(year, month);
      } catch {
        return 31;
      }
    }
    
    if (typeof hebcal === 'undefined') return 30; 
    try {
      const isLeap = hebcal.HDate.isLeapYear(year);
      const monthArr = isLeap ? HEBREW_MONTHS_ENGLISH_LEAP : HEBREW_MONTHS_ENGLISH;
      if (month < 1 || month > monthArr.length) return 30;
      const monthName = monthArr[month - 1];
      return new hebcal.HDate({hy: year, hm: monthName, hd: 1}).daysInMonth();
    } catch(e) {
      return 30; 
    }
    
  }, [calendarType, year, month]);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const handlePartChange = (part: keyof DateParts, valueStr: string) => {
    const newNumValue = valueStr ? parseInt(valueStr, 10) : null;
    const prospectiveState = { ...value, [part]: newNumValue };

    // **CRITICAL FIX**: If month or year changes, validate the existing day.
    if (part === 'year' || part === 'month') {
        const { year: newYear, month: newMonth, day: currentDay } = prospectiveState;
        
        if (newYear && newMonth && currentDay) {
            let maxDays = 30;
            if (calendarType === 'shamsi') {
                maxDays = jalaali.jalaaliMonthLength(newYear, newMonth);
            } else {
                 if (typeof hebcal !== 'undefined') {
                    const isLeap = hebcal.HDate.isLeapYear(newYear);
                    const monthArr = isLeap ? HEBREW_MONTHS_ENGLISH_LEAP : HEBREW_MONTHS_ENGLISH;
                    const monthName = monthArr[newMonth - 1];
                    if (monthName) {
                        try {
                           maxDays = new hebcal.HDate({hy: newYear, hm: monthName, hd: 1}).daysInMonth();
                        } catch {}
                    }
                 }
            }
            // If the current day is now invalid for the new context, reset it.
            if (currentDay > maxDays) {
                prospectiveState.day = null;
            }
        }
    }
    
    onChange(prospectiveState);
  };


  useEffect(() => {
      // Only calculate and show equivalent date if all parts are filled
      if (value.year && value.month && value.day) {
        const display = getEquivalentDateDisplay(value, calendarType);
        setEquivalentDate(display);
      } else {
        setEquivalentDate(null); // Clear if date is incomplete
      }
  }, [value, calendarType]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
      <div className="grid grid-cols-3 gap-3">
        {/* Swapped order for RTL layout */}
        <select
          value={day ?? ''}
          onChange={(e) => handlePartChange('day', e.target.value)}
          className={selectBaseClass}
          aria-label={`${label} - ${UI_STRINGS.day}`}
        >
          <option value="" disabled>{UI_STRINGS.day}</option>
          {days.map(d => <option key={d} value={d}>{toPersianNumber(d)}</option>)}
        </select>
        <select
          value={month ?? ''}
          onChange={(e) => handlePartChange('month', e.target.value)}
          className={selectBaseClass}
          aria-label={`${label} - ${UI_STRINGS.month}`}
        >
          <option value="" disabled>{UI_STRINGS.month}</option>
          {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
        </select>
        <select
          value={year ?? ''}
          onChange={(e) => handlePartChange('year', e.target.value)}
          className={selectBaseClass}
          aria-label={`${label} - ${UI_STRINGS.year}`}
        >
          <option value="" disabled>{UI_STRINGS.year}</option>
          {years.map(y => <option key={y} value={y}>{toPersianNumber(y)}</option>)}
        </select>
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center h-4">
        {/* Use a div instead of p for consistent height even when empty */}
        {equivalentDate}
      </div>
    </div>
  );
}