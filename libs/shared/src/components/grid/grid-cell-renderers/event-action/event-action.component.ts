import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { GridEventAction, GridEventActionType } from '../../../../models';
import { ActionsMenuComponent } from '../../../actions-menu';

@Component({
  selector: 'shared-event-action',
  imports: [
    CommonModule,
    ButtonModule,
    ActionsMenuComponent,
    TranslocoDirective,
  ],
  templateUrl: './event-action.component.html',
  styleUrl: './event-action.component.scss',
})
export class EventActionComponent {
  @Input() id: number | string = '';
  @Input() displayConfirmButton = false;
  @Input() displayConfirmedLabel = false;
  @Input() eventActions: MenuItem[] = [];
  @Output() triggerEventAction = new EventEmitter<GridEventAction>();

  onConfirmClick(): void {
    this.triggerEventAction.emit({
      id: this.id,
      actionType: GridEventActionType.Confirm,
    });
  }

  onActionClick(event: string): void {
    // Check if it's a valid enum value
    const isValidActionType = Object.values(GridEventActionType).includes(
      event as any,
    );

    if (isValidActionType) {
      this.triggerEventAction.emit({
        id: this.id,
        actionType: event as GridEventActionType,
      });
    }
  }
}
