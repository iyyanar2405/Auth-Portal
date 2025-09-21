import { CustomDatePipe } from './custom-date.pipe';

describe('CustomDatePipe', () => {
  let pipe: CustomDatePipe;

  beforeEach(() => {
    pipe = new CustomDatePipe();
  });

  test('should format a valid dd-MM-yyyy string to dd-MMM-yyyy', () => {
    // Assert
    expect(pipe.transform('07-01-2021')).toBe('07-Jan-2021');
    expect(pipe.transform('25-12-2020')).toBe('25-Dec-2020');
    expect(pipe.transform('01-08-1999')).toBe('01-Aug-1999');
  });

  test('should pad single-digit days', () => {
    // Assert
    expect(pipe.transform('3-02-2022')).toBe('03-Feb-2022');
  });

  test('should return empty string for empty input', () => {
    // Assert
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
  });

  test('should return original value for invalid date strings', () => {
    // Assert
    expect(pipe.transform('invalid')).toBe('invalid');
    expect(pipe.transform('31-02-2021')).toBe('31-02-2021');
    expect(pipe.transform('12-2021')).toBe('12-2021');
    expect(pipe.transform('12-12')).toBe('12-12');
  });
});
