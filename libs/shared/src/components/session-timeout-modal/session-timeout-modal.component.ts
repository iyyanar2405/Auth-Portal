import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { AuthService } from '../../services/auth/auth.service';
import { SharedButtonComponent, SharedButtonType } from '../button';

@Component({
  imports: [CommonModule, SharedButtonComponent, TranslocoDirective],
  templateUrl: './session-timeout-modal.component.html',
  styleUrl: './session-timeout-modal.component.scss',
})
export class SessionTimeoutModalComponent {
  sharedButtonType = SharedButtonType;

  constructor(private readonly authService: AuthService) {}

  onLoginClick(): void {
    this.authService.login();
  }
}
