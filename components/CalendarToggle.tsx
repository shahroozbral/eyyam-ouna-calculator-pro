import React from 'react';
import { UI_STRINGS } from '../constants';
import type { CalendarType } from '../types';

interface CalendarToggleProps {
  selectedType: CalendarType;
  onChange: (type: CalendarType) => void;
}

const baseClasses = "w-full py-2 px-4 text-sm font-bold rounded-md focus:outline-none transition-colors";
const activeClasses = "bg-purple-600 text-white shadow";
const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

export default function CalendarToggle({ selectedType, onChange }: CalendarToggleProps): React.ReactNode {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">
        {UI_STRINGS.selectCalendarType}
      </label>
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => onChange('shamsi')}
          className={`${baseClasses} ${selectedType === 'shamsi' ? activeClasses : inactiveClasses}`}
          aria-pressed={selectedType === 'shamsi'}
        >
          {UI_STRINGS.shamsi}
        </button>
        <button
          onClick={() => onChange('hebrew')}
          className={`${baseClasses} ${selectedType === 'hebrew' ? activeClasses : inactiveClasses}`}
          aria-pressed={selectedType === 'hebrew'}
        >
          {UI_STRINGS.hebrew}
        </button>
      </div>
    </div>
  );
}
