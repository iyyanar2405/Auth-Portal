import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customDate', standalone: true })
export class CustomDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const [day, month, year] =
      value.indexOf('-') !== -1 ? value.split('-') : value.split('.');

    if (!day || !month || !year) return value;

    const date = new Date(Number(year), Number(month) - 1, Number(day));

    if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() !== Number(year) ||
      date.getMonth() !== Number(month) - 1 ||
      date.getDate() !== Number(day)
    ) {
      return value;
    }

    const monthShort = date.toLocaleString('en-US', { month: 'short' });

    return `${day.padStart(2, '0')}-${monthShort}-${year}`;
  }
}
