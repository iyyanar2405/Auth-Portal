import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { createTranslationServiceMock } from '../../../__mocks__';
import { TimeRange } from '../../../models';
import { SharedSelectDateRangeComponent } from './select-date-range.component';
import {
  SHARED_SELECT_DATE_RANGE_DEFAULT_DATA,
  SHARED_SELECT_DATE_RANGE_LABEL_FORMAT,
  SHARED_SELECT_DATE_RANGE_SCROLL_HEIGHT_PX,
} from './select-date-range.constants';

describe('SharedSelectDateRangeComponent', () => {
  let component: SharedSelectDateRangeComponent;
  let fixture: ComponentFixture<SharedSelectDateRangeComponent>;
  let translocoService: Partial<TranslocoService>;

  beforeEach(() => {
    translocoService = createTranslationServiceMock();

    TestBed.configureTestingModule({
      imports: [SharedSelectDateRangeComponent],
      providers: [
        DatePipe,
        {
          provide: TranslocoService,
          useValue: translocoService,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SharedSelectDateRangeComponent);
    component = fixture.componentInstance;
    component.dropdown = { hide: jest.fn() } as any;
  });

  test('should initialize with default values', () => {
    // Assert
    expect(component.data()).toBe(SHARED_SELECT_DATE_RANGE_DEFAULT_DATA);
    expect(component.isRangeCustomLabelVisible()).toBeFalsy();
    expect(component.options()).toStrictEqual([
      {
        id: 'yearCurrent',
        label: `select.dateRange.yearCurrent`,
        range: expect.any(Array),
      },
      {
        id: 'monthPrevious',
        label: `select.dateRange.monthPrevious`,
        range: expect.any(Array),
      },
      {
        id: 'monthCurrent',
        label: `select.dateRange.monthCurrent`,
        range: expect.any(Array),
      },
      {
        id: 'monthNext',
        label: `select.dateRange.monthNext`,
        range: expect.any(Array),
      },
      {
        id: 'custom',
        label: `select.dateRange.custom`,
        range: expect.any(Array),
      },
    ]);
    expect(component.range()).toStrictEqual(expect.any(Array));
    expect(component.rangeCustom).toBeUndefined();
    expect(component.rangeCustomLabel()).toStrictEqual({
      start: expect.any(String),
      end: expect.any(String),
    });
    expect(component.scrollHeight).toBe(
      `${SHARED_SELECT_DATE_RANGE_SCROLL_HEIGHT_PX}px`,
    );
    expect(component.selected()).toStrictEqual({
      id: 'yearCurrent',
      label: `select.dateRange.yearCurrent`,
      range: expect.any(Array),
    });
  });

  test('should set properties correctly', () => {
    // Arrange
    fixture.componentRef.setInput('data', [TimeRange.YearCurrent]);

    // Act
    TestBed.flushEffects();
    fixture.detectChanges();

    // Assert
    expect(component.data()).toStrictEqual([TimeRange.YearCurrent]);
  });

  test('should handle onChange correctly', () => {
    // Arrange
    const mockDropdownChangeEvent = {
      originalEvent: new MouseEvent('click'),
      value: {
        range: [new Date(), new Date()],
      },
    };
    const changeEventSpy = jest.spyOn(component.changeEvent, 'emit');
    component.rangeCustom = [new Date('2024-01-01'), new Date('2024-01-07')];

    // Act
    component.onChange(mockDropdownChangeEvent);

    // Assert
    expect(component.range()).toEqual(mockDropdownChangeEvent.value.range);
    expect(changeEventSpy).toHaveBeenCalledWith(
      mockDropdownChangeEvent.value.range,
    );
    expect(component.isRangeCustomLabelVisible()).toBe(false);
    expect(component.rangeCustom).toBeNull();
  });

  test('should handle onClick correctly', () => {
    // Arrange
    const stopPropagationSpy = jest.fn();
    const mockEvent = { stopPropagation: stopPropagationSpy } as any;
    const mockDatum = {
      id: 'rabbit',
      label: 'Rabbit',
      range: [],
    };
    const mockDatumCustom = {
      id: TimeRange.Custom,
      label: 'Custom',
      range: [],
    };

    // Act
    component.onClick(mockEvent, mockDatum);

    // Assert
    expect(stopPropagationSpy).not.toHaveBeenCalled();

    // Act
    component.onClick(mockEvent, mockDatumCustom);

    // Assert
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  describe('onSelect', () => {
    let changeEventSpy: any;

    beforeEach(() => {
      changeEventSpy = jest.spyOn(component.changeEvent, 'emit');
    });

    test('should exit early if rangeCustom is null', () => {
      // Arrange
      component.rangeCustom = null;

      // Act
      component.onSelect();

      // Assert
      expect(changeEventSpy).not.toHaveBeenCalled();
    });

    test('should proceed with logic if rangeCustom is not null', () => {
      // Arrange
      const mockRange = [new Date('2024-01-01'), new Date('2024-01-07')];

      // Act
      component.rangeCustom = mockRange;
      component.onSelect();

      // Assert
      expect(component.range()).toEqual(mockRange);
      expect(component.isRangeCustomLabelVisible()).toBe(true);
      expect(changeEventSpy).toHaveBeenCalledWith(mockRange);
      expect(component.selected().id).toBe(TimeRange.Custom);
      expect(component.dropdown.hide).toHaveBeenCalled();
    });
  });

  test('should handle getOptions correctly', () => {
    // Arrange
    const mockData = [TimeRange.MonthCurrent, TimeRange.MonthNext];

    // Act
    const result = component['getOptions'](mockData);

    // Assert
    expect(result).toStrictEqual([
      {
        id: TimeRange.MonthCurrent,
        label: 'select.dateRange.monthCurrent',
        range: expect.any(Array),
      },
      {
        id: TimeRange.MonthNext,
        label: 'select.dateRange.monthNext',
        range: expect.any(Array),
      },
    ]);
  });

  test('should handle getRangeLabel correctly', () => {
    // Arrange
    const mockRange = [new Date('2024-01-01'), new Date('2024-01-07')];
    component.range.set(mockRange);

    // Act
    const result = component['getRangeLabel']();

    // Assert
    expect(result).toEqual({
      start: new DatePipe('en').transform(
        mockRange[0],
        SHARED_SELECT_DATE_RANGE_LABEL_FORMAT,
      ),
      end: new DatePipe('en').transform(
        mockRange[1],
        SHARED_SELECT_DATE_RANGE_LABEL_FORMAT,
      ),
    });
  });
});
