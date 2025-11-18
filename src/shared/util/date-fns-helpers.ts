import * as dateFNS from 'date-fns';
import {ptBR} from 'date-fns/locale';

class DateFnsHelpers {
  now() {
    return new Date();
  }

  format(date: Date | string, pattern: string) {
    return dateFNS.format(this.ensureValidDate(date as Date), pattern, {
      locale: ptBR,
    });
  }

  defaultFormat(date: Date | string) {
    return dateFNS.format(
      this.ensureValidDate(date as Date),
      'dd/MM/yyyy HH:mm',
    );
  }

  isAfter(leftDate: Date, rightDate: Date) {
    return dateFNS.isAfter(
      this.ensureValidDate(leftDate),
      this.ensureValidDate(rightDate),
    );
  }

  isNowBeforeDate(date: Date) {
    return dateFNS.isBefore(new Date(), this.ensureValidDate(date));
  }

  isNowAfterDate(date: Date) {
    return dateFNS.isAfter(new Date(), this.ensureValidDate(date));
  }

  isBeforeNow(date: Date) {
    return dateFNS.isBefore(this.ensureValidDate(date), new Date());
  }

  isAfterNow(date: Date) {
    return dateFNS.isAfter(this.ensureValidDate(date), new Date());
  }

  isBefore(leftDate: Date, rightDate: Date) {
    return dateFNS.isBefore(
      this.ensureValidDate(leftDate),
      this.ensureValidDate(rightDate),
    );
  }

  addMilliseconds(date: Date, minutes: number) {
    return dateFNS.addMilliseconds(this.ensureValidDate(date), minutes);
  }

  addMinutes(date: Date, minutes: number) {
    return dateFNS.addMinutes(this.ensureValidDate(date), minutes);
  }

  subMinutes(date: Date, minutes: number) {
    return dateFNS.subMinutes(this.ensureValidDate(date), minutes);
  }

  addDays(date: Date, days: number) {
    return dateFNS.addDays(this.ensureValidDate(date), days);
  }

  addSeconds(date: Date, seconds: number) {
    return dateFNS.addSeconds(this.ensureValidDate(date), seconds);
  }

  addHours(date: Date, hours: number) {
    return dateFNS.addHours(this.ensureValidDate(date), hours);
  }

  ensureValidDate(date: Date): Date {
    return dateFNS.isValid(date) ? date : new Date(date);
  }

  isWithinInterval(date: Date, interval: {start: Date; end: Date}): boolean {
    return dateFNS.isWithinInterval(this.ensureValidDate(date), {
      start: this.ensureValidDate(interval.start),
      end: this.ensureValidDate(interval.end),
    });
  }

  differenceInHours(leftDate: Date, rightDate: Date) {
    return dateFNS.differenceInHours(
      this.ensureValidDate(leftDate),
      this.ensureValidDate(rightDate),
    );
  }

  differenceInMinutes(leftDate: Date, rightDate: Date) {
    return dateFNS.differenceInMinutes(
      this.ensureValidDate(leftDate),
      this.ensureValidDate(rightDate),
    );
  }

  differenceInSeconds(leftDate: Date, rightDate: Date) {
    return dateFNS.differenceInSeconds(
      this.ensureValidDate(leftDate),
      this.ensureValidDate(rightDate),
    );
  }

  differenceInMinutesFromNow(date: Date) {
    return dateFNS.differenceInMinutes(new Date(), this.ensureValidDate(date));
  }

  differenceInSecondsFromNow(date: Date) {
    return dateFNS.differenceInSeconds(new Date(), this.ensureValidDate(date));
  }

  differenceInHoursFromNow(date: Date) {
    return dateFNS.differenceInHours(new Date(), this.ensureValidDate(date));
  }
}

export default new DateFnsHelpers();
