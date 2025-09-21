import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';

import { AriaLabelModifierDirective } from '../../directives';

export interface SharedButtonToggleDatum<T> {
  i18nKey?: string;
  icon?: string;
  isActive: boolean;
  label: string;
  value: T;
}

@Component({
  selector: 'shared-button-toggle',
  imports: [
    CommonModule,
    FormsModule,
    TranslocoDirective,
    SelectButtonModule,
    AriaLabelModifierDirective,
  ],
  templateUrl: './button-toggle.component.html',
  styleUrl: './button-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedButtonToggleComponent<T> {
  public options = input.required<SharedButtonToggleDatum<T>[]>();

  public changeEvent = output<T>();

  public selected = signal<T | undefined>(undefined);

  constructor() {
    effect(() => {
      this.selected.set(this.getSelected());
    });
  }

  onChange(event: SelectButtonChangeEvent): void {
    this.changeEvent.emit(event.value);
  }

  private getSelected(): T {
    return (this.options().find((o) => o.isActive) || this.options()[0]).value;
  }
}
