import { DestroyRef } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import {
  createDestroyRefMock,
  createLocaleServiceMock,
  createTranslationServiceMock,
} from '../../__mocks__';
import { CustomCalendarOptions } from '../../models';
import { LocaleService } from '../../services';
import { CustomFullCalendarComponent } from './custom-full-calendar.component';

jest.mock('@angular/core', () => {
  const originalModule = jest.requireActual('@angular/core');

  return {
    ...originalModule,
    effect: jest.fn((callback) => callback()),
  };
});

describe('CustomFullCalendarComponent', () => {
  const mockedLocaleService: Partial<LocaleService> = createLocaleServiceMock();
  let component: CustomFullCalendarComponent;
  let mockCalendarOptions!: CustomCalendarOptions;
  const tsMock: Partial<TranslocoService> = createTranslationServiceMock();
  const destroyRefMock: Partial<DestroyRef> = createDestroyRefMock();

  beforeEach(async () => {
    mockCalendarOptions = {
      scheduleStatusMap: {
        confirmed: 'confirmed',
        cancelled: 'cancelled',
      },
      events: [
        {
          scheduleId: '1',
          service: 'Meeting',
          startDate: '2024-08-01',
          endDate: '2024-08-01',
          status: 'confirmed',
          site: 'Enrich Solar Services Private Limited',
          city: 'Amsterdam',
          auditType: 'Periodic Audit, P1',
          leadAuditor: 'Arne Arnesson',
          siteRepresentative: 'Jessie McGrath',
          company: 'Enrich Solar',
        },
        {
          service: 'Conference',
          startDate: '2024-08-05',
          endDate: '2024-08-07',
          status: 'cancelled',
          scheduleId: '1',
          site: 'Enrich Solar Services Private Limited',
          city: 'Amsterdam',
          auditType: 'Periodic Audit, P1',
          leadAuditor: 'Arne Arnesson',
          siteRepresentative: 'Jessie McGrath',
          company: 'Enrich Solar',
        },
      ],
    };
    component = new CustomFullCalendarComponent(
      mockedLocaleService as LocaleService,
      tsMock as TranslocoService,
      destroyRefMock as DestroyRef,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('events input', () => {
    test('should update calendarStatuses and scheduleStatusMap', () => {
      // Arrange
      component.scheduleStatusMap = mockCalendarOptions.scheduleStatusMap;
      component.events = mockCalendarOptions.events;

      // Assert
      expect(component.calendarStatuses).toEqual(['confirmed', 'cancelled']);
    });

    test('should call setCalendarOptions when events are updated', () => {
      // Arrange
      const setCalendarOptionsSpy = jest.spyOn(
        component as any,
        'setCalendarOptions',
      );

      // Act
      component.scheduleStatusMap = mockCalendarOptions.scheduleStatusMap;
      component.events = mockCalendarOptions.events;

      // Assert
      expect(setCalendarOptionsSpy).toHaveBeenCalled();
    });
  });
});
