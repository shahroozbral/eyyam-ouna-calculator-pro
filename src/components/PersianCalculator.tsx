import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Calculator, Star, Clock, AlertCircle, CheckCircle2, Bug, ArrowUpDown } from 'lucide-react';
import { addDays, format } from 'date-fns';
import * as jalaali from 'jalaali-js';
import EmailForm from './EmailForm';
interface DateInput {
  year: string;
  month: string;
  day: string;
}
interface CalculationResult {
  persian: string;
  hebrew: string;
  weekday: string;
}
const PersianCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'persian' | 'hebrew'>('persian');
  const [prevDate, setPrevDate] = useState<DateInput>({
    year: '',
    month: '',
    day: ''
  });
  const [lastDate, setLastDate] = useState<DateInput>({
    year: '',
    month: '',
    day: ''
  });
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Persian month names
  const persianMonths = [{
    value: '1',
    name: 'فروردین'
  }, {
    value: '2',
    name: 'اردیبهشت'
  }, {
    value: '3',
    name: 'خرداد'
  }, {
    value: '4',
    name: 'تیر'
  }, {
    value: '5',
    name: 'مرداد'
  }, {
    value: '6',
    name: 'شهریور'
  }, {
    value: '7',
    name: 'مهر'
  }, {
    value: '8',
    name: 'آبان'
  }, {
    value: '9',
    name: 'آذر'
  }, {
    value: '10',
    name: 'دی'
  }, {
    value: '11',
    name: 'بهمن'
  }, {
    value: '12',
    name: 'اسفند'
  }];

  // Hebrew month names (starting with Nissan as month 1)
  const hebrewMonths = [{
    value: '1',
    name: 'نیسان'
  }, {
    value: '2',
    name: 'ایار'
  }, {
    value: '3',
    name: 'سیوان'
  }, {
    value: '4',
    name: 'تموز'
  }, {
    value: '5',
    name: 'اب'
  }, {
    value: '6',
    name: 'الول'
  }, {
    value: '7',
    name: 'تیشری'
  }, {
    value: '8',
    name: 'خشوان'
  }, {
    value: '9',
    name: 'کیسلو'
  }, {
    value: '10',
    name: 'تبت'
  }, {
    value: '11',
    name: 'شبت'
  }, {
    value: '12',
    name: 'ادار'
  }, {
    value: '13',
    name: 'ادار ب'
  }];

  // Generate year options
  const currentPersianYear = 1404;
  const currentHebrewYear = 5785;
  const persianYears = Array.from({
    length: 7
  }, (_, i) => currentPersianYear - 3 + i);
  const hebrewYears = Array.from({
    length: 7
  }, (_, i) => currentHebrewYear - 3 + i);

  // Generate day options
  const days = Array.from({
    length: 31
  }, (_, i) => i + 1);
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('mensCalculatorData');
    if (savedData) {
      try {
        const {
          activeTab: savedTab,
          prevDate: savedPrevDate,
          lastDate: savedLastDate,
          results: savedResults
        } = JSON.parse(savedData);
        setActiveTab(savedTab || 'persian');
        setPrevDate(savedPrevDate || {
          year: currentPersianYear.toString(),
          month: '3',
          day: '17'
        });
        setLastDate(savedLastDate || {
          year: currentPersianYear.toString(),
          month: '4',
          day: '15'
        });
        setResults(savedResults || []);
      } catch (error) {
        // If there's an error parsing saved data, use defaults
        setPrevDate({
          year: currentPersianYear.toString(),
          month: '3',
          day: '17'
        });
        setLastDate({
          year: currentPersianYear.toString(),
          month: '4',
          day: '15'
        });
      }
    } else {
      // Set default values for Persian calendar
      setPrevDate({
        year: currentPersianYear.toString(),
        month: '3',
        day: '17'
      });
      setLastDate({
        year: currentPersianYear.toString(),
        month: '4',
        day: '15'
      });
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    const dataToSave = {
      activeTab,
      prevDate,
      lastDate,
      results
    };
    localStorage.setItem('mensCalculatorData', JSON.stringify(dataToSave));
  }, [activeTab, prevDate, lastDate, results]);

  // Update default years when tab changes
  useEffect(() => {
    if (activeTab === 'hebrew') {
      setPrevDate(prev => ({
        ...prev,
        year: currentHebrewYear.toString()
      }));
      setLastDate(prev => ({
        ...prev,
        year: currentHebrewYear.toString()
      }));
    } else {
      setPrevDate(prev => ({
        ...prev,
        year: currentPersianYear.toString()
      }));
      setLastDate(prev => ({
        ...prev,
        year: currentPersianYear.toString()
      }));
    }
  }, [activeTab]);
  // Function to check if current date is newer than previous date
  const isDateNewer = (current: DateInput, previous: DateInput): boolean => {
    if (activeTab === 'persian') {
      const currentGregorian = jalaali.toGregorian(parseInt(current.year), parseInt(current.month), parseInt(current.day));
      const previousGregorian = jalaali.toGregorian(parseInt(previous.year), parseInt(previous.month), parseInt(previous.day));
      const currentDate = new Date(currentGregorian.gy, currentGregorian.gm - 1, currentGregorian.gd);
      const previousDate = new Date(previousGregorian.gy, previousGregorian.gm - 1, previousGregorian.gd);
      return currentDate.getTime() > previousDate.getTime();
    } else {
      const currentMs = hebrewToGregorian(parseInt(current.year), parseInt(current.month), parseInt(current.day));
      const previousMs = hebrewToGregorian(parseInt(previous.year), parseInt(previous.month), parseInt(previous.day));
      return currentMs > previousMs;
    }
  };

  // Function to swap dates if needed
  const swapDatesIfNeeded = (): boolean => {
    if (!prevDate.year || !prevDate.month || !prevDate.day || !lastDate.year || !lastDate.month || !lastDate.day) {
      return false;
    }
    if (!isDateNewer(lastDate, prevDate)) {
      const temp = {
        ...prevDate
      };
      setPrevDate({
        ...lastDate
      });
      setLastDate(temp);
      return true;
    }
    return false;
  };

  // Function to manually swap dates
  const swapDates = () => {
    const temp = {
      ...prevDate
    };
    setPrevDate({
      ...lastDate
    });
    setLastDate(temp);
  };
  const validateInputs = (): boolean => {
    if (!prevDate.year || !prevDate.month || !prevDate.day || !lastDate.year || !lastDate.month || !lastDate.day) {
      setError('لطفاً تمام فیلدها را پر کنید');
      return false;
    }

    // Auto-swap dates if needed before any calculations
    swapDatesIfNeeded();
    return true;
  };
  const formatPersianDate = (year: string, month: string, day: string): string => {
    const monthName = persianMonths.find(m => m.value === month)?.name || month;
    return `${day} ${monthName} ${year}`;
  };
  const formatHebrewDate = (year: string, month: string, day: string): string => {
    const monthName = hebrewMonths.find(m => m.value === month)?.name || month;
    return `${day} ${monthName} ${year}`;
  };
  const calculate = async () => {
    setError('');
    setSuccess(false);
    if (!validateInputs()) return;
    setLoading(true);
    try {
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Parse input dates
      const lastDay = parseInt(lastDate.day);
      const lastMonth = parseInt(lastDate.month);
      const lastYear = parseInt(lastDate.year);
      const prevDay = parseInt(prevDate.day);
      const prevMonth = parseInt(prevDate.month);
      const prevYear = parseInt(prevDate.year);
      let result1Persian, result1Hebrew, result2Persian, result2Hebrew, result3Persian, result3Hebrew;
      let result1Day, result1Month, result1Year;
      let result2Day, result2Month, result2Year;
      let result3Day, result3Month, result3Year;
      if (activeTab === 'persian') {
        // Convert Persian dates to Gregorian for calculation
        const lastGregorian = jalaali.toGregorian(lastYear, lastMonth, lastDay);
        const prevGregorian = jalaali.toGregorian(prevYear, prevMonth, prevDay);
        const lastDate_gr = new Date(lastGregorian.gy, lastGregorian.gm - 1, lastGregorian.gd);
        const prevDate_gr = new Date(prevGregorian.gy, prevGregorian.gm - 1, prevGregorian.gd);

        // Calculate interval between periods in days
        const intervalDays = Math.floor((lastDate_gr.getTime() - prevDate_gr.getTime()) / (1000 * 60 * 60 * 24));

        // Result 1: 29 days after last period (since the day itself counts)
        const result1Date_gr = new Date(lastDate_gr);
        result1Date_gr.setDate(result1Date_gr.getDate() + 29);
        const result1_jalaali = jalaali.toJalaali(result1Date_gr.getFullYear(), result1Date_gr.getMonth() + 1, result1Date_gr.getDate());
        result1Day = result1_jalaali.jd;
        result1Month = result1_jalaali.jm;
        result1Year = result1_jalaali.jy;
        result1Persian = formatPersianDate(result1Year.toString(), result1Month.toString(), result1Day.toString());
        result1Hebrew = persianToHebrew(result1Year.toString(), result1Month.toString(), result1Day.toString());

        // Result 2: Last period + cycle length
        const result2Date_gr = new Date(lastDate_gr);
        result2Date_gr.setDate(result2Date_gr.getDate() + intervalDays);
        const result2_jalaali = jalaali.toJalaali(result2Date_gr.getFullYear(), result2Date_gr.getMonth() + 1, result2Date_gr.getDate());
        result2Day = result2_jalaali.jd;
        result2Month = result2_jalaali.jm;
        result2Year = result2_jalaali.jy;
        result2Persian = formatPersianDate(result2Year.toString(), result2Month.toString(), result2Day.toString());
        result2Hebrew = persianToHebrew(result2Year.toString(), result2Month.toString(), result2Day.toString());

        // Result 3: Same day next month in Hebrew calendar
        const lastHebrewDate = persianToHebrew(lastYear.toString(), lastMonth.toString(), lastDay.toString());
        const lastHebrewParts = lastHebrewDate.split(' ');
        if (lastHebrewParts.length >= 3) {
          let hebrewDay = parseInt(lastHebrewParts[0]);
          let hebrewMonth = getHebrewMonthNumber(lastHebrewParts[1]) + 1; // Next month
          let hebrewYear = parseInt(lastHebrewParts[2]);

          // Handle special case: if current day is 30 and next month has 29 days
          if (hebrewDay === 30) {
            // Check if next month has only 29 days (common in Hebrew calendar)
            const monthsWith29Days = [2, 4, 6, 8, 10, 12]; // Iyar, Tammuz, Elul, Cheshvan, Tevet, Adar
            if (monthsWith29Days.includes(hebrewMonth)) {
              hebrewMonth += 1; // Move to month after next
              hebrewDay = 1; // First day of that month
            }
          }

          // Handle month overflow for Hebrew calendar
          const isLeapYear = (hebrewYear * 7 + 1) % 19 < 7;
          if (hebrewMonth > 12) {
            if (hebrewMonth === 13 && !isLeapYear) {
              hebrewMonth = 1;
              hebrewYear += 1;
            } else if (hebrewMonth > 13) {
              hebrewMonth = 1;
              hebrewYear += 1;
            }
          }
          result3Day = hebrewDay;
          result3Month = hebrewMonth;
          result3Year = hebrewYear;
          result3Hebrew = formatHebrewDate(hebrewYear.toString(), hebrewMonth.toString(), hebrewDay.toString());
          result3Persian = hebrewToPersian(hebrewYear.toString(), hebrewMonth.toString(), hebrewDay.toString());
        } else {
          result3Hebrew = 'نامعتبر';
          result3Persian = 'نامعتبر';
        }
      } else {
        // Hebrew calendar calculations
        const prevDateMs = hebrewToGregorian(prevYear, prevMonth, prevDay);
        const lastDateMs = hebrewToGregorian(lastYear, lastMonth, lastDay);
        const prevDate_gr = new Date(prevDateMs);
        const lastDate_gr = new Date(lastDateMs);

        // Calculate interval between periods in days
        const intervalDays = Math.floor((lastDate_gr.getTime() - prevDate_gr.getTime()) / (1000 * 60 * 60 * 24));

        // Result 1: 29 days after last period (since the day itself counts)
        const result1Date_gr = new Date(lastDate_gr);
        result1Date_gr.setDate(result1Date_gr.getDate() + 29);
        const result1Hebrew_date = gregorianToHebrew(result1Date_gr);
        result1Hebrew = result1Hebrew_date;
        result1Persian = hebrewToPersian(result1Hebrew_date.split(' ')[2], getHebrewMonthNumber(result1Hebrew_date.split(' ')[1]).toString(), result1Hebrew_date.split(' ')[0]);

        // Result 2: Last Hebrew period + calculated cycle length
        const result2Date_gr = new Date(lastDate_gr);
        result2Date_gr.setDate(result2Date_gr.getDate() + intervalDays);
        const result2Hebrew_date = gregorianToHebrew(result2Date_gr);
        result2Hebrew = result2Hebrew_date;
        result2Persian = hebrewToPersian(result2Hebrew_date.split(' ')[2], getHebrewMonthNumber(result2Hebrew_date.split(' ')[1]).toString(), result2Hebrew_date.split(' ')[0]);

        // Result 3: Same day next month in Hebrew
        result3Day = lastDay;
        result3Month = lastMonth + 1;
        result3Year = lastYear;

        // Handle special case: if current day is 30 and next month has 29 days
        if (result3Day === 30) {
          const monthsWith29Days = [2, 4, 6, 8, 10, 12]; // Iyar, Tammuz, Elul, Cheshvan, Tevet, Adar
          if (monthsWith29Days.includes(result3Month)) {
            result3Month += 1; // Move to month after next
            result3Day = 1; // First day of that month
          }
        }

        // Handle month overflow properly for Hebrew calendar
        const isLeapYear = (result3Year * 7 + 1) % 19 < 7;
        if (result3Month > 12) {
          if (result3Month === 13 && !isLeapYear) {
            result3Month = 1;
            result3Year += 1;
          } else if (result3Month > 13) {
            result3Month = 1;
            result3Year += 1;
          }
        }
        result3Hebrew = formatHebrewDate(result3Year.toString(), result3Month.toString(), result3Day.toString());
        result3Persian = hebrewToPersian(result3Year.toString(), result3Month.toString(), result3Day.toString());
      }

      // Calculate weekdays for all results
      const weekdayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
      let weekday1, weekday2, weekday3;
      if (activeTab === 'persian') {
        // Convert Persian dates to Gregorian for weekday calculation
        const result1_jalaali_gr = jalaali.toGregorian(result1Year, result1Month, result1Day);
        const result1Date_gr = new Date(result1_jalaali_gr.gy, result1_jalaali_gr.gm - 1, result1_jalaali_gr.gd);
        weekday1 = weekdayNames[result1Date_gr.getDay()];
        const result2_jalaali_gr = jalaali.toGregorian(result2Year, result2Month, result2Day);
        const result2Date_gr = new Date(result2_jalaali_gr.gy, result2_jalaali_gr.gm - 1, result2_jalaali_gr.gd);
        weekday2 = weekdayNames[result2Date_gr.getDay()];

        // For result 3, convert Hebrew date to Gregorian for weekday
        const result3Date_gr_ms = hebrewToGregorian(result3Year, result3Month, result3Day);
        const result3Date_gr = new Date(result3Date_gr_ms);
        if (!isNaN(result3Date_gr.getTime())) {
          weekday3 = weekdayNames[result3Date_gr.getDay()];
        } else {
          weekday3 = '';
        }
      } else {
        // For Hebrew calendar, calculate weekdays properly
        const result1Date_gr_ms = hebrewToGregorian(parseInt(result1Hebrew.split(' ')[2]), getHebrewMonthNumber(result1Hebrew.split(' ')[1]), parseInt(result1Hebrew.split(' ')[0]));
        const result1Date_gr = new Date(result1Date_gr_ms);
        weekday1 = weekdayNames[result1Date_gr.getDay()];
        const result2Date_gr_ms = hebrewToGregorian(parseInt(result2Hebrew.split(' ')[2]), getHebrewMonthNumber(result2Hebrew.split(' ')[1]), parseInt(result2Hebrew.split(' ')[0]));
        const result2Date_gr = new Date(result2Date_gr_ms);
        weekday2 = weekdayNames[result2Date_gr.getDay()];
        const result3Date_gr_ms = hebrewToGregorian(result3Year, result3Month, result3Day);
        const result3Date_gr = new Date(result3Date_gr_ms);
        weekday3 = weekdayNames[result3Date_gr.getDay()];
      }
      const mockResults: CalculationResult[] = [{
        persian: result1Persian,
        hebrew: result1Hebrew,
        weekday: weekday1
      }, {
        persian: result2Persian,
        hebrew: result2Hebrew,
        weekday: weekday2
      }, {
        persian: result3Persian,
        hebrew: result3Hebrew,
        weekday: weekday3
      }];
      setResults(mockResults);
      setSuccess(true);
    } catch (err) {
      setError('خطا در محاسبات رخ داد');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to add days to Hebrew date
  const addDaysToHebrewDate = (year: number, month: number, day: number, daysToAdd: number) => {
    // Convert Hebrew date to Gregorian, add days, then convert back
    const gregorianMs = hebrewToGregorian(year, month, day);
    const gregorianDate = new Date(gregorianMs);
    gregorianDate.setDate(gregorianDate.getDate() + daysToAdd);

    // Convert back to Hebrew
    const hebrewDateStr = gregorianToHebrew(gregorianDate);
    const parts = hebrewDateStr.split(' ');
    return {
      day: parseInt(parts[0]),
      month: getHebrewMonthNumber(parts[1]),
      year: parseInt(parts[2])
    };
  };

  // Convert Persian date to Hebrew date
  const persianToHebrew = (year: string, month: string, day: string): string => {
    try {
      const persianYear = parseInt(year);
      const persianMonth = parseInt(month);
      const persianDay = parseInt(day);

      // Convert Persian to Gregorian
      const gregorian = jalaali.toGregorian(persianYear, persianMonth, persianDay);
      const gregorianDate = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd);

      // Convert Gregorian to Hebrew using proper Hebrew calendar
      const hebrewFormatter = new Intl.DateTimeFormat('he-u-ca-hebrew', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        numberingSystem: 'latn'
      });
      let hebrewDate = hebrewFormatter.format(gregorianDate);

      // Remove Hebrew prefixes and clean up the string
      hebrewDate = hebrewDate.replace(/ב'/g, '').replace(/ב/g, '').replace(/'/g, '');

      // Convert Hebrew month names to Persian/Farsi equivalents
      const monthMap: {
        [key: string]: string;
      } = {
        'תשרי': 'تیشری',
        'חשון': 'خشוان',
        'חשוון': 'خשوان',
        'כסלו': 'کیسلو',
        'טבת': 'تبت',
        'שבט': 'شبت',
        'אדר': 'ادار',
        'אדר א׳': 'ادار اول',
        'אדר ב׳': 'ادار ب',
        'אדר א': 'ادار اول',
        'אדר ב': 'ادار ب',
        'ניסן': 'نیسان',
        'אייר': 'ایار',
        'סיון': 'سیوان',
        'סיוון': 'سیوان',
        'תמוז': 'تموز',
        'אב': 'اب',
        'אלול': 'الول'
      };
      let convertedDate = hebrewDate;
      for (const [hebrew, persian] of Object.entries(monthMap)) {
        convertedDate = convertedDate.replace(new RegExp(hebrew, 'g'), persian);
      }
      return convertedDate;
    } catch (error) {
      return 'نامعتبر';
    }
  };

  // Helper function to convert Hebrew to Gregorian milliseconds  
  const hebrewToGregorian = (year: number, month: number, day: number): number => {
    try {
      // Accurate reference points for Hebrew calendar conversion
      const referencePoints = [
      // Base reference: 11 Esfand 1403 = 1 Adar 5785
      {
        persian: {
          year: 1403,
          month: 12,
          day: 11
        },
        hebrew: {
          year: 5785,
          month: 12,
          day: 1
        }
      },
      // 12 Farvardin 1404 = 3 Nisan 5785
      {
        persian: {
          year: 1404,
          month: 1,
          day: 12
        },
        hebrew: {
          year: 5785,
          month: 1,
          day: 3
        }
      },
      // Corrected reference points based on accurate calculations
      {
        persian: {
          year: 1404,
          month: 5,
          day: 15
        },
        // 15 Mordad 1404 
        hebrew: {
          year: 5785,
          month: 5,
          day: 12
        } // = 12 Av 5785
      }, {
        persian: {
          year: 1404,
          month: 8,
          day: 15
        },
        // 15 Aban 1404 
        hebrew: {
          year: 5786,
          month: 8,
          day: 15
        } // = 15 Cheshvan 5786
      }, {
        persian: {
          year: 1404,
          month: 10,
          day: 15
        },
        // 15 Dey 1404 
        hebrew: {
          year: 5786,
          month: 10,
          day: 16
        } // = 16 Tevet 5786
      }, {
        persian: {
          year: 1404,
          month: 11,
          day: 15
        },
        // 15 Bahman 1404 
        hebrew: {
          year: 5786,
          month: 11,
          day: 17
        } // = 17 Shevat 5786
      }, {
        persian: {
          year: 1406,
          month: 1,
          day: 9
        },
        // 9 Farvardin 1406 = 20 Adar II 5787
        hebrew: {
          year: 5787,
          month: 13,
          day: 20
        }
      }];

      // Use the closest reference point
      let closestRef = referencePoints[0];
      let minDistance = Math.abs((year - closestRef.hebrew.year) * 365 + (month - closestRef.hebrew.month) * 30 + (day - closestRef.hebrew.day));
      for (const ref of referencePoints) {
        const distance = Math.abs((year - ref.hebrew.year) * 365 + (month - ref.hebrew.month) * 30 + (day - ref.hebrew.day));
        if (distance < minDistance) {
          minDistance = distance;
          closestRef = ref;
        }
      }

      // Convert reference Persian to Gregorian
      const refGregorian = jalaali.toGregorian(closestRef.persian.year, closestRef.persian.month, closestRef.persian.day);
      const refDate = new Date(refGregorian.gy, refGregorian.gm - 1, refGregorian.gd);

      // Calculate exact day difference using Hebrew calendar rules
      const refHebrewDaysSinceEpoch = hebrewDateToDays(closestRef.hebrew.year, closestRef.hebrew.month, closestRef.hebrew.day);
      const inputHebrewDaysSinceEpoch = hebrewDateToDays(year, month, day);
      const daysDiff = inputHebrewDaysSinceEpoch - refHebrewDaysSinceEpoch;

      // Add difference to reference Gregorian date
      const resultDate = new Date(refDate);
      resultDate.setDate(resultDate.getDate() + daysDiff);
      return resultDate.getTime();
    } catch (error) {
      return NaN;
    }
  };

  // Helper function to calculate days since Hebrew epoch (more accurate)
  const hebrewDateToDays = (year: number, month: number, day: number): number => {
    // Hebrew calendar has alternating 29 and 30 day months
    const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29]; // Nisan to Adar

    let totalDays = 0;

    // Add days from years
    for (let y = 5000; y < year; y++) {
      const isLeapYear = (y * 7 + 1) % 19 < 7;
      totalDays += isLeapYear ? 384 : 354; // Leap year has extra month
    }

    // Add days from months in current year
    for (let m = 1; m < month; m++) {
      if (m <= 12) {
        totalDays += monthLengths[m - 1];
        if (m === 8 || m === 9) {
          // Cheshvan and Kislev can vary
          totalDays += 1; // Average adjustment
        }
      } else if (m === 13) {
        // Adar II in leap year
        totalDays += 29;
      }
    }

    // Add days in current month
    totalDays += day;
    return totalDays;
  };

  // Helper function to convert Gregorian to Hebrew date string
  const gregorianToHebrew = (gregorianDate: Date): string => {
    const hebrewFormatter = new Intl.DateTimeFormat('he-u-ca-hebrew', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      numberingSystem: 'latn'
    });
    let hebrewDate = hebrewFormatter.format(gregorianDate);

    // Remove Hebrew prefixes and clean up the string
    hebrewDate = hebrewDate.replace(/ב'/g, '').replace(/ב/g, '').replace(/'/g, '');

    // Convert Hebrew month names to Persian/Farsi equivalents
    const monthMap: {
      [key: string]: string;
    } = {
      'תשרי': 'تیشری',
      'חשון': 'خشوان',
      'חשוון': 'خشوان',
      'כסלו': 'کیسلو',
      'טבת': 'تبت',
      'שבט': 'شبت',
      'אדר': 'ادار',
      'אדר א׳': 'ادار اول',
      'אדר ב׳': 'ادار ب',
      'אדר א': 'ادار اول',
      'אדר ב': 'ادار ب',
      'ניסן': 'نیسان',
      'אייר': 'ایار',
      'סיון': 'سیوان',
      'סיוון': 'سیوان',
      'תמוז': 'تموز',
      'אב': 'اب',
      'אלול': 'الول'
    };
    let convertedDate = hebrewDate;
    for (const [hebrew, persian] of Object.entries(monthMap)) {
      convertedDate = convertedDate.replace(new RegExp(hebrew, 'g'), persian);
    }
    return convertedDate;
  };

  // Helper function to get Hebrew month number from name
  const getHebrewMonthNumber = (monthName: string): number => {
    const monthMap: {
      [key: string]: number;
    } = {
      'نیسان': 1,
      'ایار': 2,
      'سیوان': 3,
      'تموز': 4,
      'اب': 5,
      'الول': 6,
      'تیشری': 7,
      'خشوان': 8,
      'کیسلو': 9,
      'تبت': 10,
      'شبت': 11,
      'ادار': 12,
      'ادار ب': 13
    };
    return monthMap[monthName] || 1;
  };

  // Convert Hebrew date to Persian date  
  const hebrewToPersian = (year: string, month: string, day: string): string => {
    try {
      const hebrewYear = parseInt(year);
      const hebrewMonth = parseInt(month);
      const hebrewDay = parseInt(day);

      // Validate inputs
      if (isNaN(hebrewYear) || isNaN(hebrewMonth) || isNaN(hebrewDay)) {
        return 'نامعتبر';
      }
      const gregorianMs = hebrewToGregorian(hebrewYear, hebrewMonth, hebrewDay);
      const gregorianDate = new Date(gregorianMs);

      // Validate the gregorian date
      if (isNaN(gregorianDate.getTime())) {
        return 'نامعتبر';
      }

      // Convert Gregorian to Persian
      const jd = jalaali.toJalaali(gregorianDate.getFullYear(), gregorianDate.getMonth() + 1, gregorianDate.getDate());
      const persianMonthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
      return `${jd.jd} ${persianMonthNames[jd.jm - 1]} ${jd.jy}`;
    } catch (error) {
      return 'نامعتبر';
    }
  };
  const DateSelector: React.FC<{
    title: string;
    icon: React.ReactNode;
    value: DateInput;
    onChange: (value: DateInput) => void;
    months: {
      value: string;
      name: string;
    }[];
    years: number[];
  }> = ({
    title,
    icon,
    value,
    onChange,
    months,
    years
  }) => <Card className="shadow-card hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg text-primary">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-semibold text-muted-foreground block mb-2">سال</label>
            <Select value={value.year} onValueChange={year => onChange({
            ...value,
            year
          })}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="سال" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground block mb-2">ماه</label>
            <Select value={value.month} onValueChange={month => onChange({
            ...value,
            month
          })}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="ماه" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => <SelectItem key={month.value} value={month.value}>{month.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground block mb-2">روز</label>
            <Select value={value.day} onValueChange={day => onChange({
            ...value,
            day
          })}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="روز" />
              </SelectTrigger>
              <SelectContent>
                {days.map(day => <SelectItem key={day} value={day.toString()}>{day}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        {value.year && value.month && value.day && <div className="bg-gradient-subtle p-4 rounded-lg border border-primary/20">
            <div className="text-center">
              <span className="text-sm text-muted-foreground">معادل: </span>
              <span className="font-bold text-primary">
                {activeTab === 'persian' ? persianToHebrew(value.year, value.month, value.day) : hebrewToPersian(value.year, value.month, value.day)}
              </span>
            </div>
          </div>}
      </CardContent>
    </Card>;
  return <div className="min-h-screen bg-gradient-subtle" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-persian text-white rounded-2xl p-8 shadow-persian">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-4">
              <Calendar className="w-10 h-10" />
              محاسبه دقیق ایام عونا
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">عونا ، زمانی است که معمولاً قاعدگی در آن شروع می شود. </p>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-8 border-2 border-persian-gold/20 bg-gradient-gold/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-persian-gold">
              <Star className="w-6 h-6" />
              راهنمای استفاده و توضیحات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed mb-4">
              لطفا در وارد کردن تاریخ ها دقت نمایید ، برای مثال اگر قاعدگی در روز 1 فروردین 1404 - 21 ادار 5786 قبل از غروب بوده ، همان روز وگرنه تاریخ قاعدگی ماه جاری  2 فروردین 1404 - 22 ادار 5786 محاسبه می شود.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              این برنامه نتیجه سوم را برای حالت خاص که تاریخ قاعدگی ماه جاری 30ام بوده و ماه بعدی 29 روزه است را اول دو ماه بعد در نظر میگیرد.
            </p>
            <p className="text-lg leading-relaxed">
              <strong>روش محاسبه:</strong> این برنامه سه تاریخ مهم را بر اساس تاریخ قاعدگی آخر محاسبه می‌کند:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-primary/10">
                <div className="font-bold text-primary mb-2">30 روز پس از قاعدگی ماه جاری</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-primary/10">
                <div className="font-bold text-primary mb-2">قاعدگی جاری + اختلاف دو قاعدگی اخیر</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-primary/10">
                <div className="font-bold text-primary mb-2">همان روز در ماه بعد عبری</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-primary">ورود اطلاعات</CardTitle>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {activeTab === 'persian' ? 'تقویم شمسی' : 'تقویم عبری'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Calendar Type Tabs */}
            <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'persian' | 'hebrew')}>
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="persian" className="text-lg font-semibold">تقویم شمسی</TabsTrigger>
                <TabsTrigger value="hebrew" className="text-lg font-semibold">تقویم عبری</TabsTrigger>
              </TabsList>

              <TabsContent value="persian" className="mt-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <DateSelector title="تاریخ قاعدگی ماه قبلی (شمسی)" icon={<Clock className="w-5 h-5" />} value={prevDate} onChange={setPrevDate} months={persianMonths} years={persianYears} />
                    <DateSelector title="تاریخ قاعدگی ماه جاری (شمسی)" icon={<Calendar className="w-5 h-5" />} value={lastDate} onChange={setLastDate} months={persianMonths} years={persianYears} />
                  </div>
                  <div className="flex justify-center">
                    <Button variant="outline" onClick={swapDates} className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      جابجایی تاریخ ها
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hebrew" className="mt-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <DateSelector title="تاریخ قاعدگی ماه قبلی (عبری)" icon={<Clock className="w-5 h-5" />} value={prevDate} onChange={setPrevDate} months={hebrewMonths} years={hebrewYears} />
                    <DateSelector title="تاریخ قاعدگی ماه جاری (عبری)" icon={<Calendar className="w-5 h-5" />} value={lastDate} onChange={setLastDate} months={hebrewMonths} years={hebrewYears} />
                  </div>
                  <div className="flex justify-center">
                    <Button variant="outline" onClick={swapDates} className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      جابجایی تاریخ ها
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Error/Success Messages */}
            {error && <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>}

            {success && <Alert className="border-persian-emerald/50 bg-persian-emerald/5">
                <CheckCircle2 className="h-4 w-4 text-persian-emerald" />
                <AlertDescription className="text-persian-emerald">
                  محاسبات با موفقیت انجام شد. نتایج در بخش پایین نمایش داده شده است.
                </AlertDescription>
              </Alert>}

            {/* Calculate Button */}
            <Button onClick={calculate} disabled={loading} size="xl" variant="persian" className="w-full">
              <Calculator className="w-6 h-6" />
              {loading ? 'در حال محاسبه...' : 'محاسبه ایام عونا'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results.length > 0 && <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-primary flex items-center justify-center gap-3">
                <Star className="w-8 h-8" />
                نتایج محاسبه
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-3 gap-6">
                {results.map((result, index) => <Card key={index} className="bg-gradient-subtle border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg text-center text-primary">
                        {index === 0 && '30 روز پس از قاعدگی ماه جاری'}
                        {index === 1 && 'قاعدگی جاری + اختلاف دو قاعدگی اخیر'}
                        {index === 2 && 'همان روز در ماه بعد عبری'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="font-semibold text-muted-foreground">تاریخ شمسی:</span>
                          <span className="font-bold text-primary persian-nums">{result.persian}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="font-semibold text-muted-foreground">تاریخ عبری:</span>
                          <span className="font-bold text-primary persian-nums">{result.hebrew}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="font-semibold text-muted-foreground">روز هفته:</span>
                          <span className="font-bold text-persian-sapphire">{result.weekday}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </CardContent>
          </Card>}

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-gradient-persian text-white rounded-xl shadow-persian">
          <p className="text-lg font-semibold mb-2">برنامه محاسبه ایام عونا</p>
          <p className="opacity-90">طراحی شده توسط شهروز برال</p>
          
          <div className="flex gap-4 justify-center mt-6">
            {/* Add to Home Screen Button */}
            <Button variant="secondary" size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30" onClick={() => {
            if ('serviceWorker' in navigator) {
              alert('برای ایجاد میانبر، از منوی مرورگر گزینه "افزودن به صفحه اصلی" را انتخاب کنید');
            }
          }}>
              <Star className="w-5 h-5 ml-2" />
              ایجاد میانبر در صفحه اصلی
            </Button>

            {/* Bug Report Button */}
            <Dialog open={showEmailForm} onOpenChange={setShowEmailForm}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Bug className="w-5 h-5 ml-2" />
                  گزارش ایراد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogTitle>گزارش ایراد برنامه</DialogTitle>
                <EmailForm onClose={() => setShowEmailForm(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>;
};
export default PersianCalculator;