import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'auth-portal-navbar-button',
  imports: [CommonModule, ButtonModule],
  templateUrl: './navbar-button.component.html',
  styleUrl: './navbar-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarButtonComponent {
  public badgeCounter = input<number | undefined>();
  public icon = input<string | undefined>();
  public iconPosition = input<'left' | 'right'>('left');
  public isActive = input<boolean>(false);
  public isDisabled = input<boolean>(false);
  public isMobileTextVisible = input<boolean>(false);
  public label = input<string | undefined>();
  public ariaLabel = input<string | undefined>(this.label());
  public isDownload = input<boolean>(false);

  public clickEvent = output<MouseEvent>();

  onClick(event: MouseEvent): void {
    this.clickEvent.emit(event);
  }
}
