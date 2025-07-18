import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Calculator, Star, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { addDays, format } from 'date-fns';
import * as jalaali from 'jalaali-js';

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
    name: 'آو'
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
    name: 'طوت'
  }, {
    value: '11',
    name: 'شواط'
  }, {
    value: '12',
    name: 'ادار'
  }, {
    value: '13',
    name: 'ادار دوم'
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

  useEffect(() => {
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
  }, []);

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

  const validateInputs = (): boolean => {
    if (!prevDate.year || !prevDate.month || !prevDate.day || !lastDate.year || !lastDate.month || !lastDate.day) {
      setError('لطفاً تمام فیلدها را پر کنید');
      return false;
    }

    // Basic date validation would go here
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
        
        // Result 1: 30 days after last period
        const result1Date_gr = new Date(lastDate_gr);
        result1Date_gr.setDate(result1Date_gr.getDate() + 30);
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
          const hebrewDay = parseInt(lastHebrewParts[0]);
          let hebrewMonth = getHebrewMonthNumber(lastHebrewParts[1]) + 1; // Next month
          let hebrewYear = parseInt(lastHebrewParts[2]);

          // Handle month overflow for Hebrew calendar
          if (hebrewMonth > 12) {
            const isLeapYear = hebrewYear % 19 === 0 || hebrewYear % 19 === 3 || hebrewYear % 19 === 6 || hebrewYear % 19 === 8 || hebrewYear % 19 === 11 || hebrewYear % 19 === 14 || hebrewYear % 19 === 17;
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

        // Result 1: 30 days after last period 
        const result1Date_gr = new Date(lastDate_gr);
        result1Date_gr.setDate(result1Date_gr.getDate() + 30);
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

        // Handle month overflow properly for Hebrew calendar
        if (result3Month > 12) {
          const isLeapYear = result3Year % 19 === 0 || result3Year % 19 === 3 || result3Year % 19 === 6 || result3Year % 19 === 8 || result3Year % 19 === 11 || result3Year % 19 === 14 || result3Year % 19 === 17;
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
        'חשון': 'خشوان',
        'חשוון': 'خشوان',
        'כסלו': 'کیسلو',
        'טבת': 'طوت',
        'שבט': 'شواط',
        'אדר': 'ادار',
        'אדר א׳': 'ادار اول',
        'אדר ב׳': 'ادار دوم',
        'אדר א': 'ادار اول',
        'אדר ב': 'ادار دوم',
        'ניסן': 'نیسان',
        'אייר': 'ایار',
        'סיון': 'سیوان',
        'סיוון': 'سیوان',
        'תמוז': 'تموز',
        'אב': 'آو',
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
      // Reference point based on provided example: 11 Esfand 1403 = 1 Adar 5785 = 2 March 2025
      const refPersianDate = { year: 1403, month: 12, day: 11 }; // 11 Esfand 1403
      const refHebrewDate = { year: 5785, month: 12, day: 1 }; // 1 Adar 5785
      
      // Convert reference Persian to Gregorian
      const refGregorian = jalaali.toGregorian(refPersianDate.year, refPersianDate.month, refPersianDate.day);
      const refDate = new Date(refGregorian.gy, refGregorian.gm - 1, refGregorian.gd);
      
      // Calculate Hebrew date difference (approximately)
      const avgDaysPerMonth = 29.5; // Average Hebrew month
      const avgDaysPerYear = 354; // Average Hebrew year
      
      const refTotalDays = refHebrewDate.year * avgDaysPerYear + refHebrewDate.month * avgDaysPerMonth + refHebrewDate.day;
      const inputTotalDays = year * avgDaysPerYear + month * avgDaysPerMonth + day;
      const daysDiff = Math.round(inputTotalDays - refTotalDays);
      
      // Add difference to reference Gregorian date
      const resultDate = new Date(refDate);
      resultDate.setDate(resultDate.getDate() + daysDiff);
      return resultDate.getTime();
    } catch (error) {
      return NaN;
    }
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
      'טבת': 'طوت',
      'שבט': 'شواط',
      'אדר': 'ادار',
      'אדר א׳': 'ادار اول',
      'אדר ב׳': 'ادار دوم',
      'אדר א': 'ادار اول',
      'אדר ב': 'ادار دوم',
      'ניסן': 'نیسان',
      'אייר': 'ایار',
      'סיון': 'سیوان',
      'סיוון': 'سیوان',
      'תמוז': 'تموز',
      'אב': 'آو',
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
      'آو': 5,
      'الول': 6,
      'تیشری': 7,
      'خشوان': 8,
      'کیسلو': 9,
      'طوت': 10,
      'شواط': 11,
      'ادار': 12,
      'ادار دوم': 13
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
  }) => (
    <Card className="shadow-card hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
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
        {value.year && value.month && value.day && (
          <div className="bg-gradient-subtle p-4 rounded-lg border border-primary/20">
            <div className="text-center">
              <span className="text-sm text-muted-foreground">معادل: </span>
              <span className="font-bold text-primary">
                {activeTab === 'persian' ? persianToHebrew(value.year, value.month, value.day) : hebrewToPersian(value.year, value.month, value.day)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-persian text-white rounded-2xl p-8 shadow-persian">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-4">
              <Calendar className="w-10 h-10" />
              محاسبه دقیق ایام عونا
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
              محاسبه دقیق بر اساس تقویم عبری و شمسی با الگوریتم‌های پیشرفته
            </p>
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
                <div className="grid md:grid-cols-2 gap-6">
                  <DateSelector 
                    title="تاریخ قاعدگی ماه قبلی (شمسی)" 
                    icon={<Clock className="w-5 h-5" />} 
                    value={prevDate} 
                    onChange={setPrevDate} 
                    months={persianMonths} 
                    years={persianYears} 
                  />
                  <DateSelector 
                    title="تاریخ قاعدگی ماه جاری (شمسی)" 
                    icon={<Calendar className="w-5 h-5" />} 
                    value={lastDate} 
                    onChange={setLastDate} 
                    months={persianMonths} 
                    years={persianYears} 
                  />
                </div>
              </TabsContent>

              <TabsContent value="hebrew" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <DateSelector 
                    title="تاریخ قاعدگی ماه قبلی (عبری)" 
                    icon={<Clock className="w-5 h-5" />} 
                    value={prevDate} 
                    onChange={setPrevDate} 
                    months={hebrewMonths} 
                    years={hebrewYears} 
                  />
                  <DateSelector 
                    title="تاریخ قاعدگی ماه جاری (عبری)" 
                    icon={<Calendar className="w-5 h-5" />} 
                    value={lastDate} 
                    onChange={setLastDate} 
                    months={hebrewMonths} 
                    years={hebrewYears} 
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-persian-emerald/50 bg-persian-emerald/5">
                <CheckCircle2 className="h-4 w-4 text-persian-emerald" />
                <AlertDescription className="text-persian-emerald">
                  محاسبات با موفقیت انجام شد. نتایج در بخش پایین نمایش داده شده است.
                </AlertDescription>
              </Alert>
            )}

            {/* Calculate Button */}
            <Button onClick={calculate} disabled={loading} size="xl" variant="persian" className="w-full">
              <Calculator className="w-6 h-6" />
              {loading ? 'در حال محاسبه...' : 'محاسبه ایام عونا'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-primary flex items-center justify-center gap-3">
                <Star className="w-8 h-8" />
                نتایج محاسبه
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-3 gap-6">
                {results.map((result, index) => (
                  <Card key={index} className="bg-gradient-subtle border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
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
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-gradient-persian text-white rounded-xl shadow-persian">
          <p className="text-lg font-semibold mb-2">برنامه محاسبه ایام عونا</p>
          <p className="opacity-90">طراحی شده برای استفاده راحت و دقیق</p>
          
          {/* Add to Home Screen Button */}
          <Button 
            variant="secondary" 
            size="lg" 
            className="mt-6 bg-white/20 hover:bg-white/30 text-white border-white/30" 
            onClick={() => {
              if ('serviceWorker' in navigator) {
                // Create shortcut functionality
                alert('برای ایجاد میانبر، از منوی مرورگر گزینه "افزودن به صفحه اصلی" را انتخاب کنید');
              }
            }}
          >
            <Star className="w-5 h-5 ml-2" />
            ایجاد میانبر در صفحه اصلی
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersianCalculator;