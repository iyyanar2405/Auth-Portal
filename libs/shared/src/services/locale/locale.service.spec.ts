import { Language } from '../../models';
import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  let service: LocaleService;

  beforeEach(() => {
    service = new LocaleService();
  });

  test('should set and get locale correctly', () => {
    // Arrange
    const newLocale = 'fr';

    // Act
    service.setLocale(newLocale);
    const locale = service.getLocale();

    // Assert
    expect(locale).toBe(newLocale);
  });

  test('should return the default locale on initialization', () => {
    // Arrange
    const defaultLocale = Language.English;

    // Act
    const locale = service.getLocale();

    // Assert
    expect(locale).toBe(defaultLocale);
  });

  test('should return the locale signal', () => {
    // Arrange
    const signal = service.getLocaleSignal();

    // Act
    const currentLocale = signal();

    // Assert
    expect(currentLocale).toBe(Language.English);
  });

  test('should reflect changes in locale signal', () => {
    // Arrange
    const newLocale = 'es';

    // Act
    service.setLocale(newLocale);
    const signal = service.getLocaleSignal();

    // Assert
    expect(signal()).toBe(newLocale);
  });
});
