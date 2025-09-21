import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@auth-portal/environments';

@Injectable({
  providedIn: 'root',
})
export class CoBrowsingCookieService {
  constructor(private readonly http: HttpClient) {}

  postUserEmailCookie(userEmail: string | null) {
    return this.http.post(
      `${environment.authApiUrl}/SetUserEmailCookie`,
      JSON.stringify(userEmail),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
