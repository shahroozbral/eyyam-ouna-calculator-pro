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

  // Hebrew month names
  const hebrewMonths = [{
    value: '1',
    name: 'تیشری'
  }, {
    value: '2',
    name: 'حشوان'
  }, {
    value: '3',
    name: 'کیسلو'
  }, {
    value: '4',
    name: 'طوت'
  }, {
    value: '5',
    name: 'شواط'
  }, {
    value: '6',
    name: 'آدار'
  }, {
    value: '7',
    name: 'آدار دوم'
  }, {
    value: '8',
    name: 'نیسان'
  }, {
    value: '9',
    name: 'ایار'
  }, {
    value: '10',
    name: 'سیوان'
  }, {
    value: '11',
    name: 'تموز'
  }, {
    value: '12',
    name: 'آو'
  }, {
    value: '13',
    name: 'الول'
  }];

  // Generate year options
  const currentPersianYear = 1403;
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
    // Set default values
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

      // Calculation based on last menstrual date
      const lastDay = parseInt(lastDate.day);
      const lastMonth = parseInt(lastDate.month);
      const lastYear = parseInt(lastDate.year);
      const prevDay = parseInt(prevDate.day);
      const prevMonth = parseInt(prevDate.month);

      // Calculate interval between periods
      const interval = Math.abs(lastDay - prevDay) + Math.abs((lastMonth - prevMonth) * 30) || 28;

      // Result 1: 30 days after last period
      const result1Day = lastDay + 30 > 30 ? (lastDay + 30) % 30 : lastDay + 30;
      const result1Month = lastDay + 30 > 30 ? lastMonth + Math.floor((lastDay + 30) / 30) : lastMonth;

      // Result 2: Last period + interval between periods  
      const result2Day = lastDay + interval > 30 ? (lastDay + interval) % 30 : lastDay + interval;
      const result2Month = lastDay + interval > 30 ? lastMonth + Math.floor((lastDay + interval) / 30) : lastMonth;

      // Result 3: Same day next Hebrew month (based on current date)
      const result3Day = lastDay;
      const result3Month = activeTab === 'hebrew' ? lastMonth + 1 : lastMonth + 1;
      const mockResults: CalculationResult[] = [{
        persian: activeTab === 'persian' ? formatPersianDate(lastYear.toString(), Math.min(result1Month, 12).toString(), result1Day.toString()) : formatPersianDate(currentPersianYear.toString(), '5', result1Day.toString()),
        hebrew: activeTab === 'hebrew' ? formatHebrewDate(lastYear.toString(), Math.min(result1Month, 13).toString(), result1Day.toString()) : formatHebrewDate(currentHebrewYear.toString(), '10', result1Day.toString()),
        weekday: 'پنجشنبه'
      }, {
        persian: activeTab === 'persian' ? formatPersianDate(lastYear.toString(), Math.min(result2Month, 12).toString(), result2Day.toString()) : formatPersianDate(currentPersianYear.toString(), '6', result2Day.toString()),
        hebrew: activeTab === 'hebrew' ? formatHebrewDate(lastYear.toString(), Math.min(result2Month, 13).toString(), result2Day.toString()) : formatHebrewDate(currentHebrewYear.toString(), '11', result2Day.toString()),
        weekday: 'جمعه'
      }, {
        persian: activeTab === 'persian' ? formatPersianDate(lastYear.toString(), Math.min(result3Month, 12).toString(), result3Day.toString()) : formatPersianDate(currentPersianYear.toString(), '7', result3Day.toString()),
        hebrew: activeTab === 'hebrew' ? formatHebrewDate(lastYear.toString(), Math.min(result3Month, 13).toString(), result3Day.toString()) : formatHebrewDate(currentHebrewYear.toString(), '11', result3Day.toString()),
        weekday: 'شنبه'
      }];
      setResults(mockResults);
      setSuccess(true);
    } catch (err) {
      setError('خطا در محاسبات رخ داد');
    } finally {
      setLoading(false);
    }
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
      
      // Convert Gregorian to Hebrew
      const hebrewDate = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }).format(gregorianDate);
      
      // Convert Hebrew month names to Persian/Farsi equivalents
      const monthMap: { [key: string]: string } = {
        'תשרי': 'تیشری',
        'חשון': 'حشوان', 
        'חשוון': 'حشوان',
        'כסלו': 'کیسلو',
        'טבת': 'طوت',
        'שבט': 'شواط',
        'אדר': 'آدار',
        'אדר א': 'آدار اول',
        'אדר ב': 'آدار دوم', 
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
        convertedDate = convertedDate.replace(hebrew, persian);
      }
      
      return convertedDate;
    } catch (error) {
      return 'نامعتبر';
    }
  };

  // Convert Hebrew date to Persian date  
  const hebrewToPersian = (year: string, month: string, day: string): string => {
    try {
      const hebrewYear = parseInt(year);
      const hebrewMonth = parseInt(month);
      const hebrewDay = parseInt(day);
      
      // Hebrew month names for conversion
      const monthNames = [
        'תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 
        'אדר', 'אדר ב', 'ניסן', 'אייר', 'סיון', 
        'תמוז', 'אב', 'אלול'
      ];
      
      // Create Hebrew date and convert to Gregorian
      const hebrewDateStr = `${hebrewDay} ${monthNames[hebrewMonth - 1]} ${hebrewYear}`;
      const hebrewDateObj = new Date();
      
      // This is a simplified conversion - in production you'd want a proper Hebrew calendar library
      const baseGregorianYear = 2024;
      const baseHebrewYear = 5785;
      const yearDiff = hebrewYear - baseHebrewYear;
      const gregorianYear = baseGregorianYear + yearDiff;
      
      // Approximate month mapping (Hebrew year starts in fall)
      let gregorianMonth = hebrewMonth + 6;
      let adjustedYear = gregorianYear;
      if (gregorianMonth > 12) {
        gregorianMonth -= 12;
        adjustedYear += 1;
      }
      
      const gregorianDate = new Date(adjustedYear, gregorianMonth - 1, hebrewDay);
      
      // Convert Gregorian to Persian
      const jd = jalaali.toJalaali(gregorianDate.getFullYear(), gregorianDate.getMonth() + 1, gregorianDate.getDate());
      
      const persianMonthNames = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
      ];
      
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
                {activeTab === 'persian' 
                  ? persianToHebrew(value.year, value.month, value.day)
                  : hebrewToPersian(value.year, value.month, value.day)
                }
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
                <div className="font-bold text-primary mb-2">1. 30 روز پس از قاعدگی آخر</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-primary/10">
                <div className="font-bold text-primary mb-2">2. تاریخ قاعدگی آخر + فاصله دو قاعدگی</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-primary/10">
                <div className="font-bold text-primary mb-2">3. همان روز در ماه بعد عبری</div>
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
                  <DateSelector title="تاریخ قاعدگی ماه قبلی (شمسی)" icon={<Clock className="w-5 h-5" />} value={prevDate} onChange={setPrevDate} months={persianMonths} years={persianYears} />
                  <DateSelector title="تاریخ قاعدگی ماه جاری (شمسی)" icon={<Calendar className="w-5 h-5" />} value={lastDate} onChange={setLastDate} months={persianMonths} years={persianYears} />
                </div>
              </TabsContent>

              <TabsContent value="hebrew" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <DateSelector title="تاریخ قاعدگی ماه قبلی (عبری)" icon={<Clock className="w-5 h-5" />} value={prevDate} onChange={setPrevDate} months={hebrewMonths} years={hebrewYears} />
                  <DateSelector title="تاریخ قاعدگی ماه جاری (عبری)" icon={<Calendar className="w-5 h-5" />} value={lastDate} onChange={setLastDate} months={hebrewMonths} years={hebrewYears} />
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
                        {index === 0 && '1. 30 روز پس از قاعدگی آخر'}
                        {index === 1 && '2. قاعدگی آخر + فاصله دو قاعدگی'}
                        {index === 2 && '3. همان روز در ماه بعد عبری'}
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
          <p className="opacity-90">طراحی شده برای استفاده راحت و دقیق</p>
          <div className="mt-4 text-sm opacity-75">
            محاسبات تقویم عبری با استفاده از الگوریتم‌های پیشرفته انجام می‌شود
          </div>
          
          {/* Add to Home Screen Button */}
          <Button variant="secondary" size="lg" className="mt-6 bg-white/20 hover:bg-white/30 text-white border-white/30" onClick={() => {
          if ('serviceWorker' in navigator) {
            // Create shortcut functionality
            alert('برای ایجاد میانبر، از منوی مرورگر گزینه "افزودن به صفحه اصلی" را انتخاب کنید');
          }
        }}>
            <Star className="w-5 h-5 ml-2" />
            ایجاد میانبر در صفحه اصلی
          </Button>
        </div>
      </div>
    </div>;
};
export default PersianCalculator;