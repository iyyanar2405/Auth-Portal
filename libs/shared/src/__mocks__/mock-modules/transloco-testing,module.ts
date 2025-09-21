import { ModuleWithProviders } from '@angular/core';
import {
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@jsverse/transloco';

import { Language } from '../../models';

const en = {
  english: 'English',
  italian: 'Italian',
};
const it = {
  english: 'English',
  italian: 'Italian',
};

export function getTranslocoModule(
  options: TranslocoTestingOptions = {},
): ModuleWithProviders<TranslocoTestingModule> {
  return TranslocoTestingModule.forRoot({
    langs: { en, it },
    translocoConfig: {
      availableLangs: [Language.English, Language.Italian],
      defaultLang: Language.English,
    },
    preloadLangs: true,
    ...options,
  });
}
