import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { SharedButtonType } from './button.constants';

@Component({
  selector: 'shared-button',
  imports: [CommonModule, ButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedButtonComponent {
  public type = input.required<SharedButtonType>();
  public autofocus = input<boolean>(false);
  public icon = input<string>();
  public iconPos = input<'left' | 'right'>('left');
  public isDisabled = input<boolean>(false);
  public label = input<string>();
  public size = input<'small' | 'large'>('large');

  public clickEvent = output<MouseEvent | undefined>();

  public iconClass = computed(() =>
    this.icon() ? `pi pi-${this.icon()}` : undefined,
  );
  public severity = computed(() =>
    this.type() === SharedButtonType.Primary ? 'success' : undefined,
  );
  public sharedButtonType = SharedButtonType;

  onClick(event?: MouseEvent): void {
    this.clickEvent.emit(event);
  }
}
