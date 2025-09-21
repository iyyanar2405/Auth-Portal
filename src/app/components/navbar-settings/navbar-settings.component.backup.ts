import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { LocalAuthService } from '../../../../libs/shared/src/services/auth.service';

// Mock interfaces and enums
enum Language {
  English = 'en',
  Italian = 'it'
}

enum SettingsTab {
  General = 'general',
  Privacy = 'privacy'
}

@Component({
  selector: 'auth-portal-navbar-settings',
  imports: [
    CommonModule,
    OverlayPanelModule,
  ],
  templateUrl: './navbar-settings.component.html',
  styleUrl: './navbar-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarSettingsComponent {
  public isButtonSettingsActive = signal<boolean>(false);
  public isLanguagePickerVisible = false;
  public languages = signal([Language.English, Language.Italian]);
  public settingsTab = SettingsTab;
  public isDnvUser = signal(false);

  constructor(
    private readonly authService: LocalAuthService,
    private readonly router: Router,
  ) {}

  onChangeLanguage(language: Language): void {
    console.log('Language changed to:', language);
  }

  onChangeLanguagePickerVisibility(value: boolean): void {
    this.isLanguagePickerVisible = value;
  }

  onLogoutClick(overlayPanel: OverlayPanel, event: MouseEvent): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onButtonActiveChange(active: boolean): void {
    this.isButtonSettingsActive.set(active);
  }
}