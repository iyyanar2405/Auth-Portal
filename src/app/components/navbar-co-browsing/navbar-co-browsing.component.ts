import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

// Mock services
class CoBrowsingSharedService {
  isActive$ = new BehaviorSubject(false);
  isActive = signal(false);
  
  toggle(): void {
    const newValue = !this.isActive();
    this.isActive.set(newValue);
    this.isActive$.next(newValue);
  }
}

class CoBrowsingCookieService {
  setCookie(name: string, value: string): void {
    console.log(`Cookie set: ${name} = ${value}`);
  }
}

class AppInitializerService {
  initialize(): void {
    console.log('App initialized');
  }
}

@Component({
  selector: 'auth-portal-navbar-co-browsing',
  imports: [CommonModule],
  templateUrl: './navbar-co-browsing.component.html',
  styleUrl: './navbar-co-browsing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarCoBrowsingComponent {
  constructor(
    public readonly coBrowsingSharedService: CoBrowsingSharedService,
    private readonly coBrowsingCookieService: CoBrowsingCookieService,
    private readonly appInitializerService: AppInitializerService,
  ) {}

  onToggleCoBrowsing(): void {
    this.coBrowsingSharedService.toggle();
  }

  onCoBrowsingEndModal(): void {
    console.log('Co-browsing end modal triggered');
  }

  onCoBrowsingEndConfirm(): void {
    console.log('Co-browsing ended');
    this.coBrowsingSharedService.isActive.set(false);
  }
}
