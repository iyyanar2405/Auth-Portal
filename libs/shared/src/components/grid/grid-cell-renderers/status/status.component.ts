import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TooltipThemes } from '../../../../constants';
import { TippyTooltipDirective } from '../../../../directives';

@Component({
  selector: 'shared-status',
  imports: [CommonModule, TippyTooltipDirective],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent {
  private _value!: string;
  TooltipTheme = TooltipThemes;
  className = '';
  @Input() statusClassMap!: Record<string, string>;

  @Input()
  set value(status: string) {
    this._value = status;
    this.className = this.getStatus(this._value);
  }

  get value(): string {
    return this._value;
  }

  getStatus(status: string): string {
    const normalizedStatus = status.toLowerCase();

    return status && this.statusClassMap[normalizedStatus]
      ? this.statusClassMap[normalizedStatus]
      : 'misty-rose';
  }
}
