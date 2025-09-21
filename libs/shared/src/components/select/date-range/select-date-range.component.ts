import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { CalendarModule } from 'primeng/calendar';
import {
  Dropdown,
  DropdownChangeEvent,
  DropdownModule,
} from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { getTimeRange } from '../../../helpers';
import { TimeRange } from '../../../models';
import {
  SHARED_SELECT_DATE_RANGE_DEFAULT_DATA,
  SHARED_SELECT_DATE_RANGE_LABEL_FORMAT,
  SHARED_SELECT_DATE_RANGE_SCROLL_HEIGHT_PX,
} from './select-date-range.constants';

export interface SharedSelectDateRangeDatum {
  id: string;
  label: string;
  range: Date[];
}

@Component({
  selector: 'shared-select-date-range',
  imports: [
    CommonModule,
    FormsModule,
    TranslocoDirective,
    CalendarModule,
    DropdownModule,
    OverlayPanelModule,
  ],
  providers: [DatePipe],
  templateUrl: './select-date-range.component.html',
  styleUrl: './select-date-range.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedSelectDateRangeComponent {
  @ViewChild('dropdown') dropdown!: Dropdown;

  public ariaLabel = input<string>();
  public data = input<TimeRange[]>(SHARED_SELECT_DATE_RANGE_DEFAULT_DATA);
  public isDisabled = input<boolean>(false);
  public prefill = input<TimeRange>();

  public changeEvent = output<Date[]>();

  public isRangeCustomLabelVisible = signal(false);
  public options = computed<SharedSelectDateRangeDatum[]>(() =>
    this.getOptions(this.data()),
  );
  public range = signal<Date[]>(this.options()[0].range);
  public rangeCustom!: Date[] | null;
  public rangeCustomLabel = computed<any>(() => this.getRangeLabel());
  public scrollHeight = `${SHARED_SELECT_DATE_RANGE_SCROLL_HEIGHT_PX}px`;
  public selected = signal<SharedSelectDateRangeDatum>(this.options()[0]);

  constructor(private readonly datePipe: DatePipe) {
    effect(() => {
      this.selected.set(this.getSelected());
    });
  }

  onChange(event: DropdownChangeEvent): void {
    this.rangeCustom = null;
    this.range.set(event.value.range);
    this.isRangeCustomLabelVisible.set(false);
    this.changeEvent.emit(this.range());
  }

  onClick(event: Event, datum: SharedSelectDateRangeDatum): void {
    if (datum.id === TimeRange.Custom) {
      event.stopPropagation();
    }
  }

  onSelect(): void {
    if (!this.rangeCustom) {
      return;
    }

    if (this.rangeCustom.every((d) => d !== null)) {
      this.range.set(this.rangeCustom);
      this.isRangeCustomLabelVisible.set(true);
      this.changeEvent.emit(this.range());
      this.selected.set(
        this.options().find(
          (opt) => opt.id === TimeRange.Custom,
        ) as SharedSelectDateRangeDatum,
      );
      this.dropdown.hide();
    }
  }

  private getOptions(data: TimeRange[]): SharedSelectDateRangeDatum[] {
    return data.map((datum) => ({
      id: datum,
      label: `select.dateRange.${datum}`,
      range: getTimeRange(datum),
    }));
  }

  private getSelected(): SharedSelectDateRangeDatum {
    return (
      this.options().find((o) => o.id === this.prefill()) || this.options()[0]
    );
  }

  private getRangeLabel() {
    return {
      start: this.datePipe.transform(
        new Date(this.range()[0]),
        SHARED_SELECT_DATE_RANGE_LABEL_FORMAT,
      ),
      end: this.datePipe.transform(
        new Date(this.range()[1]),
        SHARED_SELECT_DATE_RANGE_LABEL_FORMAT,
      ),
    };
  }
}
