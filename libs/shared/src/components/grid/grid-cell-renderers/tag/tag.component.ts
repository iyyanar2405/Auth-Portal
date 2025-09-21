import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';

export const DEFAULT_CLASS_NAME = 'misty-rose';
@Component({
  selector: 'shared-tag',
  imports: [CommonModule, TagModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
})
export class TagComponent {
  private _tagValue: string | undefined = '';
  private _tagClassesMap: Record<string, string> = {};

  @Input() rounded = true;

  @Input() set tagClassesMap(classMap: Record<string, string>) {
    this._tagClassesMap = classMap;
    this.className = this.getClassName(this.tagValue);
  }

  get tagClassesMap() {
    return this._tagClassesMap;
  }

  @Input() set tagValue(severity: string | undefined) {
    this._tagValue = severity;
    this.className = this.getClassName(this.tagValue);
  }

  get tagValue() {
    return this._tagValue;
  }

  className = '';

  private getClassName(tagValue: string | undefined): string {
    return tagValue && this.tagClassesMap[tagValue]
      ? this.tagClassesMap[tagValue]
      : DEFAULT_CLASS_NAME;
  }
}
