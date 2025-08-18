import { DateParts } from '../../types';

// Inform TypeScript about the global `hebcal` object from the script tag
declare const hebcal: any;

export const getHebrewDefaultDates = (): { lastPeriod: DateParts; prevPeriod: DateParts } => {
  if (typeof hebcal === 'undefined') {
    // Fallback if hebcal is not loaded
    return {
      lastPeriod: { year: null, month: null, day: null },
      prevPeriod: { year: null, month: null, day: null }
    };
  }

  try {
    // Get today's Hebrew date
    const today = new hebcal.HDate();
    
    // Get Hebrew date one month ago
    const oneMonthAgo = new hebcal.HDate(today).subtract(1, 'm');

    return {
      lastPeriod: {
        year: today.year,
        month: today.month,
        day: today.day
      },
      prevPeriod: {
        year: oneMonthAgo.year,
        month: oneMonthAgo.month,
        day: oneMonthAgo.day
      }
    };
  } catch (error) {
    console.error('Error getting Hebrew default dates:', error);
    return {
      lastPeriod: { year: null, month: null, day: null },
      prevPeriod: { year: null, month: null, day: null }
    };
  }
};