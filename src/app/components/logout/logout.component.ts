import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { environment } from '@customer-portal/environments';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { AuthService } from '@customer-portal/shared/services';

@Component({
  selector: 'customer-portal-logout',
  imports: [CommonModule, SharedButtonComponent, TranslocoDirective],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit {
  dnvLink = environment.dnvLink;
  sharedButtonType = SharedButtonType;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.resetLogoutState();
  }

  onLoginClick(): void {
    this.authService.login();
  }

  onGoToDnvClick(): void {
    window.open(this.dnvLink, '_self');
  }
}
