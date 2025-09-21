import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { DateTime } from 'luxon';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { map, Observable, take, tap } from 'rxjs';

import {
  BLANK_FILTER,
  DEFAULT_DATE_FORMAT,
  SHORT_MONTH_DATE_FORMAT,
  SHORT_MONTH_DATE_FORMAT_PRIMENG,
} from '../../../../constants';
import { convertStringToDate } from '../../../../helpers';
import { FilteringConfig } from '../../../../models';

@Component({
  selector: 'shared-date-filter',
  imports: [
    CommonModule,
    CalendarModule,
    CheckboxModule,
    FormsModule,
    TranslocoDirective,
  ],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateFilterComponent implements OnInit {
  @Input() filter: any;
  @Input() selectionMode: 'single' | 'range' = 'range';
  @Input() filteringConfig$!: Observable<FilteringConfig>;
  @Input() field = '';
  @Input() dateFormat = SHORT_MONTH_DATE_FORMAT_PRIMENG;

  @Input() set options(values: any) {
    if (values.length && values[values.length - 1]?.label === BLANK_FILTER) {
      this.isBlankOptionVisible = true;
    } else {
      this.isBlankOptionVisible = false;
    }
  }

  placeholder = '';
  date!: Date | Date[];
  isBlankOptionVisible = false;
  isBlankSelected = false;

  constructor(private ts: TranslocoService) {}

  ngOnInit(): void {
    this.placeholder =
      this.selectionMode === 'range'
        ? `${SHORT_MONTH_DATE_FORMAT} - ${SHORT_MONTH_DATE_FORMAT}`
        : SHORT_MONTH_DATE_FORMAT;
    this.initializeSelectedRange();
  }

  public onChangeEmptyValue(): void {
    if (this.isBlankSelected) {
      this.filter([{ label: this.ts.translate('blank'), value: BLANK_FILTER }]);
      this.date = undefined as any;
    } else {
      this.filter([]);
    }
  }

  onSelectDate(date: Date[] | undefined | any): void {
    const isArray = Array.isArray(date);
    let transformedDate:
      | { label: string; value: string }
      | { label: string | null; value: string | null }[];

    if (isArray && !(date[0] && date[1])) {
      return;
    }

    if (isArray) {
      transformedDate = date.map((dateItem: Date) => {
        const newDate = DateTime.fromISO(dateItem.toISOString()).toFormat(
          DEFAULT_DATE_FORMAT,
        );

        return {
          label: newDate,
          value: newDate,
        };
      });
    } else {
      transformedDate = {
        label: DateTime.fromISO(date.toISOString()).toFormat(
          DEFAULT_DATE_FORMAT,
        ),
        value: DateTime.fromISO(date.toISOString()).toFormat(
          DEFAULT_DATE_FORMAT,
        ),
      };
    }

    this.filter(transformedDate);
  }

  private initializeSelectedRange(): void {
    this.filteringConfig$
      .pipe(
        take(1),
        map((config) => config[this.field]?.value || []),
        tap((filters) => {
          if (!filters.length) return;

          if (filters.length > 1) {
            this.date = filters.map((filter) =>
              convertStringToDate(filter.value),
            );
          } else if (
            filters.length === 1 &&
            filters[0].value === BLANK_FILTER
          ) {
            this.isBlankSelected = true;
          } else {
            this.date = convertStringToDate(filters[0].value);
          }
        }),
      )
      .subscribe();
  }
}
