import { Injectable, signal, WritableSignal } from '@angular/core';

import { Language } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private localeId = signal<string>(Language.English);

  setLocale(id: string) {
    this.localeId.set(id);
  }

  getLocale(): string {
    return this.localeId();
  }

  getLocaleSignal(): WritableSignal<string> {
    return this.localeId;
  }
}
