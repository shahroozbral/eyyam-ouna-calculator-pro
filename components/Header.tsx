import React from 'react';
import { UI_STRINGS } from '../constants';
import { CalendarIcon } from './icons/CalendarIcon';

export default function Header(): React.ReactNode {
  return (
    <header className="text-center">
      <div className="inline-block gradient-bg p-3 rounded-full shadow-md mb-4">
        <CalendarIcon className="w-8 h-8 text-primary-foreground" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
        {UI_STRINGS.title}
      </h1>
    </header>
  );
}