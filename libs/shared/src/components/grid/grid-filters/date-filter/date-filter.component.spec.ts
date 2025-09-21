import { TranslocoService } from '@jsverse/transloco';
import { DateTime } from 'luxon';
import { of } from 'rxjs';

import { createTranslationServiceMock } from '../../../../__mocks__';
import { BLANK_FILTER } from '../../../../constants';
import { FilterMode, FilterOperator } from '../../../../models';
import { DateFilterComponent } from './date-filter.component';

describe('DateFilterComponent', () => {
  let component: DateFilterComponent;
  const mockedTranslocoService: Partial<TranslocoService> =
    createTranslationServiceMock();

  beforeEach(() => {
    component = new DateFilterComponent(
      mockedTranslocoService as TranslocoService,
    );
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      (component as any).initializeSelectedRange = jest.fn();
    });

    test('should set the correct placeholder for range selection mode and initialize selected range', () => {
      // Arrange
      component.selectionMode = 'range';

      // Act
      component.ngOnInit();

      // Assert
      expect(component.placeholder).toBe('dd-MMM-yyyy - dd-MMM-yyyy');
      expect((component as any).initializeSelectedRange).toHaveBeenCalled();
    });

    test('should set the correct placeholder for single selection mode', () => {
      // Arrange
      component.selectionMode = 'single';

      // Act
      component.ngOnInit();

      // Assert
      expect(component.placeholder).toBe('dd-MMM-yyyy');
    });
  });

  describe('onSelectDate', () => {
    beforeEach(() => {
      component.filter = jest.fn();
    });

    test('should trigger filter and transform a single date correctly', () => {
      // Arrange
      const date = new Date('2023-05-23');
      const expectedPayload = {
        label: '23-05-2023',
        value: '23-05-2023',
      };

      // Act
      component.onSelectDate(date);

      // Assert
      expect(component.filter).toHaveBeenCalledWith(expectedPayload);
    });

    test('should trigger filter and transform an array of dates correctly', () => {
      // Arrange
      const dates = [new Date('2023-05-23'), new Date('2023-06-23')];
      const expectedPayload = [
        { label: '23-05-2023', value: '23-05-2023' },
        { label: '23-06-2023', value: '23-06-2023' },
      ];

      // Act
      component.onSelectDate(dates);

      // Assert
      expect(component.filter).toHaveBeenCalledWith(expectedPayload);
    });

    test('should not trigger filter for range when one of the dates is missing', () => {
      // Arrange
      const dates = [new Date('2023-05-23'), null];

      // Act
      component.onSelectDate(dates);

      // Assert
      expect(component.filter).not.toHaveBeenCalled();
    });
  });

  describe('initializeSelectedRange', () => {
    test('should set date to an array of dates when filters length is more than 1', (done) => {
      // Arrange
      const filteringConfig$ = of({
        startDate: {
          matchMode: FilterMode.DateAfter,
          operator: FilterOperator.And,
          value: [
            {
              label: '01-05-2024',
              value: '01-05-2024',
            },
            {
              label: '04-05-2024',
              value: '04-05-2024',
            },
          ],
        },
      });
      component.filteringConfig$ = filteringConfig$;
      component.field = 'startDate';

      // Act
      (component as any).initializeSelectedRange();

      filteringConfig$.subscribe(() => {
        // Assert
        expect(component.date).toEqual([
          DateTime.fromFormat('01-05-2024', 'dd-MM-yyyy').toJSDate(),
          DateTime.fromFormat('04-05-2024', 'dd-MM-yyyy').toJSDate(),
        ]);
        done();
      });
    });

    test('should set date to a single date when filters length is 1', (done) => {
      // Arrange
      const filteringConfig$ = of({
        startDate: {
          matchMode: FilterMode.DateAfter,
          operator: FilterOperator.And,
          value: [
            {
              label: '01-05-2024',
              value: '01-05-2024',
            },
          ],
        },
      });
      component.filteringConfig$ = filteringConfig$;
      component.field = 'startDate';

      // Act
      (component as any).initializeSelectedRange();

      filteringConfig$.subscribe(() => {
        // Assert
        expect(component.date).toEqual(
          DateTime.fromFormat('01-05-2024', 'dd-MM-yyyy').toJSDate(),
        );
        done();
      });
    });
  });

  describe('when blank date is selected', () => {
    test('should call filter with correct parameters and set date to undefined when isBlankSelected is true', () => {
      // Arrange
      component.isBlankSelected = true;
      const filterFn = jest.fn();
      component.filter = filterFn;

      // Act
      component.onChangeEmptyValue();

      // Assert
      expect(filterFn).toHaveBeenCalledWith([
        { label: undefined, value: BLANK_FILTER },
      ]);
      expect(component.date).toBeUndefined();
    });

    test('should call filter with empty array when isBlankSelected is false', () => {
      // Arrange
      component.isBlankSelected = false;
      const filterFn = jest.fn();
      component.filter = filterFn;

      // Act
      component.onChangeEmptyValue();

      // Assert
      expect(filterFn).toHaveBeenCalledWith([]);
    });
  });
});
