import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalAuthService } from '../../../../libs/shared/src/services/auth.service';

@Component({
  selector: 'auth-portal-logout',
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit {
  dnvLink = 'https://www.dnv.com';

  constructor(
    private readonly authService: LocalAuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Perform logout and redirect
    this.authService.logout();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000); // Wait 2 seconds then redirect
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  onGoToDnvClick(): void {
    window.open(this.dnvLink, '_self');
  }
}
