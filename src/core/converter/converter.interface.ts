import { PhoneNumberFormat as PNF } from 'google-libphonenumber';

export type DateTimeLikeTypeT = string | Date;

export interface IDateConverter {
  format(date: DateTimeLikeTypeT, inputFormat: string, outputFormat: string): string;
  formatUiDate(date?: DateTimeLikeTypeT): string;
  formatUiDateTime(date?: DateTimeLikeTypeT): string;
  formatDate(date: DateTimeLikeTypeT, outputFormat: string): string;
  formatDateTime(date: DateTimeLikeTypeT, outputFormat: string): string;
  formatPSTDateTime(date?: DateTimeLikeTypeT): string;
  toDate(date: DateTimeLikeTypeT, inputFormat: string): DateTimeLikeTypeT;
  getDateRangeFromDate(date: Date): Date[];
  getCurrentDate(date?: Date): Date;
  getFirstDayOfMonth(): Date;
  get30DaysAgo(): Date;
  getLocalizedMonth(index: number): string;
  getLocalizedMonthShort(index: number): string;
  getLocalizedWeekday(index: number): string;
  getLocalizedWeekdayShort(index: number): string;
  combine(dateAsString: string, timeAsString: string): string;
}

export interface INumberConverter {
  number(value: string | number): string | number;
  format(value: number | string): string;
  currency(value: number | string, options?: Intl.NumberFormatOptions): string;
  phone(value: number | string, phoneNumberFormat?: PNF): string;
  id(value: number | string): string;
}
