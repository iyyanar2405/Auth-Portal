import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { TagModule } from 'primeng/tag';

import { TooltipThemes } from '../../../../../constants';
import { TippyTooltipDirective } from '../../../../../directives';
import { ActiveFilterTag } from '../../../../../models';

@Component({
  selector: 'shared-active-filter-tag',
  imports: [CommonModule, TagModule, TranslocoDirective, TippyTooltipDirective],
  templateUrl: './active-filter-tag.component.html',
  styleUrl: './active-filter-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveFilterTagComponent {
  private _tag!: ActiveFilterTag;
  tagLabel!: string;

  @Input() shouldPersist = true;

  @Input()
  set tag(value: ActiveFilterTag) {
    this._tag = value;
    this.tagLabel = `${this.ts.translate(this._tag.displayName)} : ${this._tag.label}`;
  }

  get tag(): ActiveFilterTag {
    return this._tag;
  }

  @Output()
  saveFilter = new EventEmitter<ActiveFilterTag>();
  @Output()
  deleteSavedFilter = new EventEmitter<ActiveFilterTag>();
  @Output()
  removeFilter = new EventEmitter<ActiveFilterTag>();

  TooltipThemes = TooltipThemes;

  constructor(private ts: TranslocoService) {}

  onSaveFilterClick(): void {
    this.tag.isSaved = true;
    this.saveFilter.emit(this.tag);
  }

  onDeleteSavedFilterClick(): void {
    this.tag.isSaved = false;
    this.deleteSavedFilter.emit(this.tag);
  }
}
