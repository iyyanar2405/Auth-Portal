import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  output,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';

import {
  BaseServiceNowParams,
  LoggingService,
  ServiceNowService,
} from '@customer-portal/core';
import { UnreadActionsStoreService } from '@customer-portal/data-access/actions/state';
import { UnreadNotificationsStoreService } from '@customer-portal/data-access/notifications/state';
import {
  ProfileLanguageStoreService,
  ProfileStoreService,
} from '@customer-portal/data-access/settings';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers';
import { ToastSeverity } from '@customer-portal/shared/models';
import { CoBrowsingSharedService } from '@customer-portal/shared/services';

import { NavbarButtonComponent } from '../navbar-button';
import { NavbarDownloadComponent } from '../navbar-download';
import { NavbarSettingsComponent } from '../navbar-settings';

@Component({
  selector: 'customer-portal-navbar',
  imports: [
    CommonModule,
    TranslocoDirective,
    NavbarButtonComponent,
    NavbarSettingsComponent,
    NavbarDownloadComponent,
  ],
  providers: [UnreadNotificationsStoreService, UnreadActionsStoreService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  public toggleSidebarEvent = output<boolean>();
  serviceNowService = inject(ServiceNowService);

  messageService = inject(MessageService);
  loggingService = inject(LoggingService);

  constructor(
    private readonly router: Router,
    public unreadNotificationsStoreService: UnreadNotificationsStoreService,
    public unreadActionsStoreService: UnreadActionsStoreService,
    private ts: TranslocoService,
    public readonly coBrowsingSharedService: CoBrowsingSharedService,
    public profileLanguageStoreService: ProfileLanguageStoreService,
    public profileStoreService: ProfileStoreService,
  ) {}

  ngOnInit(): void {
    this.unreadNotificationsStoreService.loadUnreadNotifications();
    this.unreadActionsStoreService.loadUnreadActions();
  }

  onToggleSidebar(value: boolean): void {
    this.toggleSidebarEvent.emit(value);
  }

  onNavigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  onActionsClick(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  openServiceNowGeneralHelp(): void {
    try {
      const helpParams: BaseServiceNowParams = {
        language: this.profileLanguageStoreService.languageLabel(),
        reportingCountry:
          this.profileStoreService.profileInformation().countryCode,
      };
      this.serviceNowService.openCatalogItemSupport(helpParams);
    } catch (error) {
      const message = getToastContentBySeverity(ToastSeverity.Error);
      message.summary = this.ts.translate('serviceNow.error');
      this.messageService.add(message);

      this.loggingService.logException(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}
