import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';

import { SidebarComponent } from '../sidebar';

@Component({
  selector: 'customer-portal-sidebar-mobile',
  imports: [CommonModule, SidebarModule, SidebarComponent],
  templateUrl: './sidebar-mobile.component.html',
  styleUrl: './sidebar-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMobileComponent {
  public isVisible = signal<boolean>(false);

  onToggle(value: boolean): void {
    this.isVisible.set(value);
  }
}
