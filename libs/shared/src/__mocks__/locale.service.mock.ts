import { signal } from '@angular/core';

import { LocaleService } from '../services';

export const createLocaleServiceMock = (): Partial<LocaleService> => ({
  getLocale: jest.fn(),
  getLocaleSignal: () => signal(''),
  setLocale: jest.fn(),
});
