import { Injectable } from '@angular/core';

import { environment } from '@auth-portal/environments';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  loadServiceNowScript(): void {
    const { scriptUrl } = environment.serviceNow;

    const script = document.createElement('script');

    Object.assign(script, {
      type: 'text/javascript',
      src: scriptUrl,
      async: true,
    });

    document.body.appendChild(script);
  }
}
