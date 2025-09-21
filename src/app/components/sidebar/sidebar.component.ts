import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';

import { ProfileStoreService } from '@customer-portal/data-access/settings';

@Component({
  selector: 'customer-portal-sidebar',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TranslocoDirective,
    ButtonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  public closeEvent = output<void>();

  constructor(public readonly profileStoreService: ProfileStoreService) {}

  onClose(): void {
    this.closeEvent.emit();
  }

  onNavigateTo(url: string): void {
    window.open(url, '_blank');
  }
}
