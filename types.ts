export type CalendarType = 'shamsi' | 'hebrew';

export interface DateParts {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface CalculatedDate {
  hebrew: string;
  shamsi: string;
  dayOfWeek: string;
}

export interface CalculationResult {
  vesetHachodesh: CalculatedDate;
  yomHaflaga: CalculatedDate;
  onaBeinonit: CalculatedDate;
  interval: number;
}