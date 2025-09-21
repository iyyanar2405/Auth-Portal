import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { SharedButtonComponent, SharedButtonType } from '../../button';

@Component({
  selector: 'shared-empty-grid',
  imports: [TranslocoDirective, SharedButtonComponent],
  templateUrl: './empty-grid.component.html',
  styleUrl: './empty-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyGridComponent {
  @Input() isDocumentsGrid = false;
  @Input({ required: true }) hasActiveFilters = false;
  @Input({ required: true }) isGridEmpty = false;

  @Output() addDocuments = new EventEmitter<void>();

  sharedButtonType = SharedButtonType;

  onAddDocuments(): void {
    this.addDocuments.emit();
  }
}
