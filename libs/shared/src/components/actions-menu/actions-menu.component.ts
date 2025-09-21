import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'shared-actions-menu',
  imports: [CommonModule, ButtonModule, MenuModule, TranslocoDirective],
  templateUrl: './actions-menu.component.html',
  styleUrl: './actions-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsMenuComponent {
  @Input() items: MenuItem[] = [];
  @Output() selectedItem = new EventEmitter<string>();

  onItemClick(item: MenuItem): void {
    this.selectedItem.emit(item.label);
  }
}
