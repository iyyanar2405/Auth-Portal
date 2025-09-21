import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { ErrorCardComponent } from '@customer-portal/shared/components/error-card';
import { AuthService } from '@customer-portal/shared/services/auth';

@Component({
  selector: 'customer-portal-welcome',
  imports: [
    CommonModule,
    SharedButtonComponent,
    TranslocoDirective,
    ErrorCardComponent,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
  isUserValidated?: boolean;
  sharedButtonType = SharedButtonType;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.isUserValidated = window.history.state?.isUserValidated;
  }

  onLoginClick(): void {
    this.authService.login();
  }
}
