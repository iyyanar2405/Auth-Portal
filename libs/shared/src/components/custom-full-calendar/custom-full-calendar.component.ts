import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { Calendar, CalendarOptions, EventApi } from '@fullcalendar/core';
import allLocales from '@fullcalendar/core/locales-all';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { TranslocoService } from '@jsverse/transloco';
import { delay, Subject } from 'rxjs';
import tippy from 'tippy.js';

import { TooltipThemes } from '../../constants';
import { AriaLabelModifierDirective } from '../../directives';
import { CalendarViewType, CustomCalendarEvent } from '../../models';
import { LocaleService } from '../../services';
import { StatusComponent } from '../grid';

@Component({
  selector: 'shared-custom-full-calendar',
  imports: [
    CommonModule,
    FullCalendarModule,
    StatusComponent,
    AriaLabelModifierDirective,
  ],
  templateUrl: './custom-full-calendar.component.html',
  styleUrl: './custom-full-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFullCalendarComponent implements AfterViewInit {
  private _events!: CustomCalendarEvent[];

  calendarStatuses: string[] = [];
  calendarOptions: WritableSignal<CalendarOptions | undefined> =
    signal(undefined);
  calendarApi!: Calendar;
  calendarLocale = this.localeService.getLocaleSignal();
  onViewChange$: Subject<void> = new Subject();
  @Input() scheduleStatusMap!: Record<string, string>;
  currentDate: any;
  currentEvents!: EventApi;
  @Input() selectedDate!: Date | undefined;

  @Input()
  calendarViewType!: CalendarViewType;

  @Input() set events(value: CustomCalendarEvent[]) {
    this._events = value;
    this.calendarStatuses = Object?.keys(this.scheduleStatusMap || []);
    this.setCalendarOptions();
  }

  @Output() dateChange = new EventEmitter<{
    currentYear: number;
    currentMonth: number;
  }>();

  @Output() eventClick = new EventEmitter<{
    id: number;
    status: string;
    date: string;
  }>();

  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;

  constructor(
    private localeService: LocaleService,
    private ts: TranslocoService,
    private destroyRef: DestroyRef,
  ) {
    effect(() => {
      this.setCalendarOptions();
    });
  }

  ngAfterViewInit(): void {
    this.calendarApi = this.fullcalendar.getApi();
    this.scrollToToday();
    this.handleScrollOnViewChange();

    if (this.selectedDate) {
      this.calendarApi.gotoDate(this.selectedDate);
    }
  }

  handleEvents(): void {
    if (this.calendarApi) {
      const currentYear = this.calendarApi.view.currentStart.getUTCFullYear();
      let currentMonth = this.calendarApi.view.currentStart.getMonth() + 1;

      if (this.calendarApi.view.type === CalendarViewType.Year) {
        currentMonth = 0;
      }
      this.dateChange.emit({ currentMonth, currentYear });
    }
  }

  handleEventClick(event: any): void {
    const { id } = event.event;
    const status = this._events.find(
      (e) => Number(e.scheduleId) === Number(id),
    );
    this.eventClick.emit({
      id: event.event.id,
      status: status?.status || '',
      date: status?.startDate || '',
    });
  }

  scrollToToday(): void {
    this.calendarApi.gotoDate(new Date());
    this.calendarApi.el
      .getElementsByClassName('fc-day-today')[0]
      .scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
  }

  handleScrollOnViewChange(): void {
    this.onViewChange$
      .pipe(delay(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.scrollToToday();
      });
  }

  private setCalendarOptions(): void {
    this.calendarOptions.set({
      // Localization & Plugins
      locales: allLocales,
      locale: this.calendarLocale(),
      plugins: [dayGridPlugin, multiMonthPlugin],
      timeZone: 'UTC',

      // Initial State
      initialView: this.calendarViewType || CalendarViewType.Month,
      initialDate: this.selectedDate || new Date(),
      firstDay: 1,
      weekends: true,
      height: 'auto',
      displayEventTime: false,

      // Toolbar & Buttons
      headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: `${CalendarViewType.Month},${CalendarViewType.Year}`,
      },
      buttonIcons: {
        prev: 'reset pi pi-angle-left',
        next: 'reset pi pi-angle-right',
      },
      customButtons: {
        today: {
          text: this.ts.translate('calendar.today'),
          click: () => {
            this.scrollToToday();
          },
        },
      },

      // View & Layout Configurations
      multiMonthMaxColumns: 2,
      dayMaxEvents: true,
      views: {
        dayGrid: {
          dayMaxEvents: 3,
        },
      },

      // Event Handling
      events: this._events?.map((event: CustomCalendarEvent) => ({
        title: `${event.service}, ${event.city}, ${event.site}`,
        start: event.startDate,
        end: `${event.endDate}T24:00:00.000Z`,
        id: event.scheduleId,
        className: this.scheduleStatusMap
          ? this.scheduleStatusMap[event.status.toLocaleLowerCase()]
          : '',
        status: event.status,
        allDay: true,
      })),

      // Callbacks & Interactions
      eventDidMount: (info) => {
        tippy(info.el, {
          content: info.event.title,
          delay: [200, 0],
          theme: TooltipThemes.Dark,
        });
      },
      datesSet: this.handleEvents.bind(this),
      eventClick: this.handleEventClick.bind(this),
      viewDidMount: () => {
        this.onViewChange$.next();
      },
    });
  }
}
