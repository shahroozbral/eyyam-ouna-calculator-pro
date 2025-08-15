import jalaali from 'jalaali-js';
import { CalculationResult, CalculatedDate, CalendarType, DateParts } from '../types';
import { HEBREW_MONTHS_PERSIAN, SHAMSI_MONTHS_PERSIAN, DAYS_OF_WEEK_PERSIAN, HEBREW_MONTHS_ENGLISH_LEAP, HEBREW_MONTHS_ENGLISH } from '../constants';

// Inform TypeScript about the global `hebcal` object from the script tag
declare const hebcal: any;

const toPersianNumber = (n: number | string): string => {
  return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

const formatHebrewDatePersian = (hdate: any): string => {
  if (!hdate) return "";
  const day = toPersianNumber(hdate.day);
  const monthKey = hdate.month_str;
  const month = HEBREW_MONTHS_PERSIAN[monthKey] || hdate.month_str;
  const year = toPersianNumber(hdate.year);
  return `${day} ${month} ${year}`;
};

const formatShamsiDatePersian = (jdate: { jy: number, jm: number, jd: number }): string => {
  if (!jdate) return "";
  const day = toPersianNumber(jdate.jd);
  const month = SHAMSI_MONTHS_PERSIAN[jdate.jm - 1];
  const year = toPersianNumber(jdate.jy);
  return `${day} ${month} ${year}`;
};

const shamsiToGregorian = (dateParts: DateParts): Date | null => {
  if (!dateParts.year || !dateParts.month || !dateParts.day) return null;
  try {
    // jalaali.toGregorian throws an error for invalid dates (e.g., month 1, day 32)
    const { gy, gm, gd } = jalaali.toGregorian(dateParts.year, dateParts.month, dateParts.day);
    return new Date(Date.UTC(gy, gm - 1, gd));
  } catch (e) {
    console.error("Shamsi to Gregorian conversion failed:", e);
    return null;
  }
};

const hebrewToGregorian = (dateParts: DateParts): Date | null => {
  if (!dateParts.year || !dateParts.month || !dateParts.day) return null;
  try {
    const isLeap = hebcal.HDate.isLeapYear(dateParts.year);
    const monthName = (isLeap ? HEBREW_MONTHS_ENGLISH_LEAP : HEBREW_MONTHS_ENGLISH)[dateParts.month - 1];
    if (!monthName) return null; // Invalid month index
    return new hebcal.HDate({ hy: dateParts.year, hm: monthName, hd: dateParts.day }).greg();
  } catch (e) {
    console.error("Hebrew to Gregorian conversion failed:", e);
    return null;
  }
};

const getCalculatedDate = (hdate: any): CalculatedDate => {
  const gregDate = hdate.greg();
  // Set a consistent time to avoid timezone issues affecting date conversions
  gregDate.setUTCHours(12);
  const shamsiDate = jalaali.toJalaali(gregDate);

  return {
    hebrew: formatHebrewDatePersian(hdate),
    shamsi: formatShamsiDatePersian(shamsiDate),
    dayOfWeek: DAYS_OF_WEEK_PERSIAN[gregDate.getUTCDay()],
  };
};

export const getEquivalentDateDisplay = (dateParts: DateParts, calendarType: CalendarType): string | null => {
    if (typeof hebcal === 'undefined' || !jalaali) return null;
    if (!dateParts.year || !dateParts.month || !dateParts.day) return null;

    const gregorianDate = calendarType === 'shamsi' 
        ? shamsiToGregorian(dateParts) 
        : hebrewToGregorian(dateParts);

    if (!gregorianDate) return "تاریخ نامعتبر";

    gregorianDate.setUTCHours(12);
    const dayOfWeek = DAYS_OF_WEEK_PERSIAN[gregorianDate.getUTCDay()];
    
    if (calendarType === 'shamsi') {
        const hdate = new hebcal.HDate(gregorianDate);
        return `${dayOfWeek}، معادل ${formatHebrewDatePersian(hdate)}`;
    } else { // hebrew
        const jdate = jalaali.toJalaali(gregorianDate);
        return `${dayOfWeek}، معادل ${formatShamsiDatePersian(jdate)}`;
    }
};

export const calculateOnaDates = (
  lastPeriod: DateParts,
  prevPeriod: DateParts,
  calendarType: CalendarType
): { result: CalculationResult | null; error?: 'invalid_date' | 'date_order' } => {
  if (typeof hebcal === 'undefined') return { result: null, error: 'invalid_date' };

  const toGregorian = calendarType === 'shamsi' ? shamsiToGregorian : hebrewToGregorian;
  const lastPeriodDate = toGregorian(lastPeriod);
  const prevPeriodDate = toGregorian(prevPeriod);

  if (!lastPeriodDate || !prevPeriodDate) {
    return { result: null, error: 'invalid_date' };
  }
  
  // Set a consistent time to avoid off-by-one day errors from timezones
  lastPeriodDate.setUTCHours(12, 0, 0, 0);
  prevPeriodDate.setUTCHours(12, 0, 0, 0);

  if (lastPeriodDate.getTime() <= prevPeriodDate.getTime()) {
      return { result: null, error: 'date_order' };
  }
  
  try {
    const lastHDate = new hebcal.HDate(lastPeriodDate);
    const prevHDate = new hebcal.HDate(prevPeriodDate);

    const onaBeinonitHDate = new hebcal.HDate(lastHDate).add(29, 'days');

    const interval = Math.round((lastPeriodDate.getTime() - prevPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
    const yomHaflagaHDate = new hebcal.HDate(lastHDate).add(interval, 'days');

    let vesetHachodeshHDate;
    // Special rule for periods on the 30th day of a Hebrew month
    if (lastHDate.day === 30) {
        // The "Veset Hachodesh" is considered to be the 1st of the next month
        const firstOfCurrentMonth = new hebcal.HDate({ hy: lastHDate.year, hm: lastHDate.month_str, hd: 1 });
        vesetHachodeshHDate = firstOfCurrentMonth.add(1, 'm');
    } else {
        vesetHachodeshHDate = new hebcal.HDate(lastHDate).add(1, 'm');
        // Handle standard clipping (e.g., 30 Iyyar -> 29 Sivan if Iyyar has 30 and Sivan has 29)
        // If the user request for "day 1 of next month" applies here, more logic is needed.
        // For now, using Hebcal's default clipping is most robust.
    }

    return {
      result: {
        onaBeinonit: getCalculatedDate(onaBeinonitHDate),
        yomHaflaga: getCalculatedDate(yomHaflagaHDate),
        vesetHachodesh: getCalculatedDate(vesetHachodeshHDate),
        interval: interval,
      },
    };
  } catch (error) {
    console.error("Error in date calculation:", error);
    return { result: null, error: 'invalid_date' };
  }
};