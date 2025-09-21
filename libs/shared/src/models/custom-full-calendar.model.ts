import { PluginDef } from '@fullcalendar/core';

import { CalendarViewType } from './calendar-view-type.model';

export type InitialViewOption = CalendarViewType.Year | CalendarViewType.Year;

export interface CustomCalendarOptions {
  plugins?: PluginDef[];
  initialView?: InitialViewOption;
  weekends?: boolean;
  scheduleStatusMap: Record<string, string>;
  events: CustomCalendarEvent[];
}

export interface CustomCalendarEvent {
  scheduleId: string;
  startDate: string;
  endDate: string;
  status: string;
  service: string;
  site: string;
  city: string;
  auditType: string;
  leadAuditor: string;
  siteRepresentative: string;
  company: string;
}
