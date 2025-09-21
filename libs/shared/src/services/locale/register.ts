import { registerLocaleData } from '@angular/common';
import localeEN from '@angular/common/locales/en';
import localeIT from '@angular/common/locales/it';

export function registerLocales(): void {
  registerLocaleData(localeEN);
  registerLocaleData(localeIT);
}
