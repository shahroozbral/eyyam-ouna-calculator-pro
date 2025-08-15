import React from 'react';
import type { CalculatedDate } from '../types';

interface ResultCardProps {
  title: string;
  date: CalculatedDate;
  description: string;
}

export default function ResultCard({ title, date, description }: ResultCardProps): React.ReactNode {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 rounded-xl shadow-md p-5 transition-transform hover:scale-105 hover:shadow-xl">
      <div className="flex items-start space-x-4 space-x-reverse">
        <div className="flex-shrink-0 bg-purple-100 text-purple-600 rounded-lg p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <div className="flex-1">
          <h3 className="text-md font-bold text-purple-800">{title}</h3>
          <div className="mt-1">
            <p className="text-lg font-bold text-gray-900">{date.dayOfWeek}</p>
            <p className="text-xl font-bold text-gray-800">{date.shamsi}</p>
            <p className="text-md text-gray-600 mt-1">{date.hebrew}</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        </div>
      </div>
    </div>
  );
}
