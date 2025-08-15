import React from 'react';
import { UI_STRINGS } from '../constants';
import { CalendarIcon } from './icons/CalendarIcon';

export default function Header(): React.ReactNode {
  return (
    <header className="text-center">
      <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full shadow-md mb-4">
        <CalendarIcon className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        {UI_STRINGS.title}
      </h1>
    </header>
  );
}
