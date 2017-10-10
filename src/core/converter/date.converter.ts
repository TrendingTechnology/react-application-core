import * as moment from 'moment';

import { provideInSingleton } from '../di';

import {
  IDateConverter,
  IDateLocaleSpecificConstants,
  IDateLocaleSpecificConstantsRepo,
} from './converter.interface';

@provideInSingleton(DateConverter)
export class DateConverter implements IDateConverter {

  private static DATE_TIME_PARSE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  private static DATE_TIME_ISO_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSSZ';

  private static LOCALE_SPECIFIC: IDateLocaleSpecificConstantsRepo = {
    en: {
      dateFormat: 'YYYY-MM-DD',
      dateMask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
      datePattern: '[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])',
    },
  };

  public formatDateTime(date: string | Date,
                        format: string = DateConverter.DATE_TIME_ISO_FORMAT,
                        parseFormat: string = DateConverter.DATE_TIME_PARSE_FORMAT): string {
    if (!date) {
      return '';
    } else {
      const momentDate = this.toMomentDate(date, parseFormat);
      return momentDate.isValid()
          ? momentDate.format(format)
          : String(date);
    }
  }

  public formatDate(date: string | Date, format: string = this.localeSpecificConstants.dateFormat): string {
    if (!date) {
      return '';
    } else {
      const momentDate = this.toMomentDate(date, format);
      return momentDate.isValid()
          ? momentDate.format(format)
          : String(date);
    }
  }

  public tryConvertToDate(date: string | Date,
                          format: string = this.localeSpecificConstants.dateFormat): string | Date {
    const momentDate = this.toMomentDate(date, format);
    return momentDate.isValid() ? momentDate.toDate() : date;
  }

  public getDateRangeFromDate(date: Date): Date[] {
    const momentDate = this.getCurrentMomentDate(date);
    return [momentDate.toDate(), momentDate.clone().add(1, 'day').subtract(1, 'second').toDate()];
  }

  public isDate(date: Date|string): boolean {
    return moment.isDate(date);
  }

  public getCurrentDate(date?: Date): Date {
    return this.getCurrentMomentDate(date).toDate();
  }

  private toMomentDate(date: string | Date, format: string): moment.Moment {
    return moment.isDate(date)
        ? moment(date)
        : moment(date, format, true);
  }

  private getCurrentMomentDate(date?: Date): moment.Moment {
    return moment(date).set('h', 0).set('m', 0).set('s', 0);
  }

  public get localeSpecificConstants(): IDateLocaleSpecificConstants {
    // TODO current env locale
    return DateConverter.LOCALE_SPECIFIC.en;
  }
}
