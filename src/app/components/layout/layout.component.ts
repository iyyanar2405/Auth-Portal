import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { SessionTimeoutService, SpinnerComponent } from '@customer-portal/core';
import { CustomConfirmDialogComponent } from '@customer-portal/shared/components/custom-confirm-dialog';
import { CustomToastComponent } from '@customer-portal/shared/components/custom-toast';
import { AuthTokenConstants } from '@customer-portal/shared/constants';
import { BreadcrumbService } from '@customer-portal/shared/services/breadcrumb';
import { CoBrowsingSharedService } from '@customer-portal/shared/services/co-browsing';
import { ScriptLoaderService } from '@customer-portal/shared/services/loader';

import { BreadcrumbComponent } from '../breadcrumb';
import { FooterComponent } from '../footer';
import { NavbarComponent } from '../navbar';
import { NavbarCoBrowsingComponent } from '../navbar-co-browsing';
import { SidebarComponent } from '../sidebar';
import { SidebarMobileComponent } from '../sidebar-mobile';

@Component({
  selector: 'customer-portal-layout',
  standalone: true,
  imports: [
    ButtonModule,
    RouterModule,
    SpinnerComponent,
    CustomConfirmDialogComponent,
    CustomToastComponent,
    ToastModule,
    BreadcrumbComponent,
    NavbarComponent,
    SidebarComponent,
    SidebarMobileComponent,
    FooterComponent,
    NavbarCoBrowsingComponent,
    CommonModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  title = 'customer-portal';
  isLoggedIn = false;
  isDnvUser = false;
  breadcrumbVisibility = false;

  constructor(
    public readonly coBrowsingSharedService: CoBrowsingSharedService,
    private readonly scriptLoader: ScriptLoaderService,
    private readonly sessionTimeoutService: SessionTimeoutService,
    private readonly breadcrumbService: BreadcrumbService,
    private destroyRef: DestroyRef,
  ) {
    this.breadcrumbService.breadcrumbVisibility$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((visibility: boolean) => {
        this.breadcrumbVisibility = visibility;
      });
  }

  ngOnInit(): void {
    this.initializeApp();
  }

  private initializeApp(): void {
    this.initializeScripts();
    this.initializeSession();
    this.initializeUserState();
  }

  private initializeScripts(): void {
    this.scriptLoader.loadServiceNowScript();
  }

  private initializeSession(): void {
    const tokenExpiry = localStorage.getItem(
      AuthTokenConstants.TOKEN_EXPIRY_KEY,
    );
    if (!tokenExpiry) return;

    const expiryDate = new Date(tokenExpiry);

    if (expiryDate > new Date()) {
      this.isLoggedIn = true;
      this.sessionTimeoutService.initialize(expiryDate);
    }
  }

  private initializeUserState(): void {
    this.isDnvUser = !!window.history.state?.isDnvUser;
  }
}
