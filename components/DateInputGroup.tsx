import React from 'react';
import { UI_STRINGS } from '../constants';
import type { CalendarType, DateParts } from '../types';
import CalendarToggle from './CalendarToggle';
import DatePickerSelect from './DatePickerSelect';

interface DateInputGroupProps {
  calendarType: CalendarType;
  onCalendarTypeChange: (type: CalendarType) => void;
  lastPeriod: DateParts;
  onLastPeriodChange: (parts: DateParts) => void;
  prevPeriod: DateParts;
  onPrevPeriodChange: (parts: DateParts) => void;
}

export default function DateInputGroup({
  calendarType,
  onCalendarTypeChange,
  lastPeriod,
  onLastPeriodChange,
  prevPeriod,
  onPrevPeriodChange,
}: DateInputGroupProps): React.ReactNode {
  
  return (
    <div className="mt-6 space-y-6">
      <CalendarToggle
        selectedType={calendarType}
        onChange={onCalendarTypeChange}
      />
      <DatePickerSelect
        label={UI_STRINGS.lastPeriodLabel}
        calendarType={calendarType}
        value={lastPeriod}
        onChange={onLastPeriodChange}
      />
      <DatePickerSelect
        label={UI_STRINGS.previousPeriodLabel}
        calendarType={calendarType}
        value={prevPeriod}
        onChange={onPrevPeriodChange}
      />
    </div>
  );
}