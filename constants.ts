export const HEBREW_MONTHS_PERSIAN: { [key: string]: string } = {
  "Nisan": "نیسان",
  "Iyyar": "ایار",
  "Iyar": "ایار", // Variation
  "Sivan": "سیوان",
  "Tammuz": "تموز",
  "Tamuz": "تموز", // Variation
  "Av": "آو",
  "Elul": "الول",
  "Tishrei": "تیشری",
  "Tishri": "تیشری", // Variation
  "Cheshvan": "خشوان",
  "Heshvan": "خشوان", // Variation
  "Kislev": "کیسلو",
  "Tevet": "طوت",
  "Teveth": "طوت", // Variation
  "Sh'vat": "شواط",
  "Shevat": "شواط", // Variation
  "Adar": "ادار", // For non-leap years
  "Adar I": "ادار", // For leap years
  "Adar II": "ادار ب", // For leap years
};

export const HEBREW_MONTHS_ENGLISH = [
  "Nisan", "Iyyar", "Sivan", "Tammuz", "Av", "Elul", "Tishrei", "Cheshvan", "Kislev", "Tevet", "Sh'vat", "Adar"
];

// For leap years
export const HEBREW_MONTHS_ENGLISH_LEAP = [
  "Nisan", "Iyyar", "Sivan", "Tammuz", "Av", "Elul", "Tishrei", "Cheshvan", "Kislev", "Tevet", "Sh'vat", "Adar I", "Adar II"
];


export const SHAMSI_MONTHS_PERSIAN: string[] = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

export const DAYS_OF_WEEK_PERSIAN: string[] = [
  "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"
];

export const UI_STRINGS = {
  title: "محاسبه‌گر پیشرفته ایام عونا",
  subtitle: "تقویم ورودی را انتخاب کرده و دو تاریخ قاعدگی را وارد کنید.",
  selectCalendarType: "تقویم ورودی:",
  shamsi: "شمسی",
  hebrew: "عبری",
  lastPeriodLabel: "تاریخ قاعدگی جاری",
  previousPeriodLabel: "تاریخ قاعدگی قبلی",
  year: "سال",
  month: "ماه",
  day: "روز",
  calculateButton: "محاسبه کن",
  resultsTitle: "تاریخ‌های احتمالی بعدی",
  dateOrderError: "خطا: تاریخ قاعدگی جاری باید بعد از تاریخ قبلی باشد.",
  invalidDateError: "خطا: حداقل یکی از تاریخ‌های وارد شده نامعتبر است. لطفا روز، ماه و سال را انتخاب کنید.",
  waitingForInput: "لطفا نوع تقویم و هر دو تاریخ را برای مشاهده نتایج وارد کرده و دکمه محاسبه را بزنید.",
  onaBeinonitTitle: "اونا بنونیت (روز سی‌ام)",
  onaBeinonitDescription: "۲۹ روز پس از شروع قاعدگی جاری (که روز سی‌ام می‌شود).",
  yomHaflagaTitle: "یوم هفلاگا (فاصله بین دو دوره)",
  yomHaflagaDescription: (interval: string) => `بر اساس فاصلۀ ${interval} روزه بین دو قاعدگی اخیر.`,
  vesetHachodeshTitle: "وست هخودش (همان روز در ماه عبری)",
  vesetHachodeshDescription: "همان روز از ماه در ماه عبری بعدی.",
};