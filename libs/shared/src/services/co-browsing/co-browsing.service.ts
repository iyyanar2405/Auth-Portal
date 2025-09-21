import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoBrowsingSharedService {
  private userEmail = signal<string | null>(null);

  setCoBrowsingUserEmail(userEmail: string | null): void {
    this.userEmail.set(userEmail);
  }

  getCoBrowsingUserEmail(): string | null {
    return this.userEmail();
  }
}
