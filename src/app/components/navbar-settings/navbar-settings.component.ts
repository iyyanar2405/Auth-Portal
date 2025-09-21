import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

import {
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
  SettingsTab,
} from '@customer-portal/data-access/settings';
import { environment } from '@customer-portal/environments';
import { AppPagesEnum } from '@customer-portal/shared/constants';
import { Language } from '@customer-portal/shared/models';
import { AuthService } from '@customer-portal/shared/services';

import { NavbarButtonComponent } from '../navbar-button';

@Component({
  selector: 'customer-portal-navbar-settings',
  imports: [
    CommonModule,
    TranslocoDirective,
    OverlayPanelModule,
    NavbarButtonComponent,
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
  public isDnvUser = this.settingsCoBrowsingStoreService.isDnvUser;

  constructor(
    private readonly authService: AuthService,
    private readonly profileLanguageStoreService: ProfileLanguageStoreService,
    private readonly settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
  ) {}

  onChangeLanguage(language: Language): void {
    this.translocoService.setActiveLang(language);

    if (!this.isDnvUser()) {
      this.profileLanguageStoreService.updateProfileLanguage(language);
    }
  }

  onChangeLanguagePickerVisibility(value: boolean): void {
    this.isLanguagePickerVisible = value;
  }

  onLogoutClick(overlayPanel: OverlayPanel, event: MouseEvent): void {
    this.authService.logout().subscribe(() => {
      overlayPanel.onCloseClick(event);
      window.location.href = `${environment.federatedLogoutUrl}${environment.baseUrl}${AppPagesEnum.Logout}`;
    });
  }

  onNavigateTo(
    route: string,
    tab: string,
    overlayPanel: OverlayPanel,
    event: MouseEvent,
  ): void {
    overlayPanel.onCloseClick(event);
    this.router.navigate([`/${route}`], { queryParams: { tab } });
  }

  onToggleButtonSettingsActive(value: boolean): void {
    this.isButtonSettingsActive.set(value);

    if (!value) {
      this.onChangeLanguagePickerVisibility(false);
    }
  }

  onToggleOverlayPanel(overlayPanel: OverlayPanel, event: MouseEvent): void {
    overlayPanel.toggle(event);
  }
}
