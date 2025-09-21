import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'shared-text-with-icon',
  imports: [CommonModule, TooltipModule, TranslocoModule],
  templateUrl: './text-with-icon.component.html',
  styleUrl: './text-with-icon.component.scss',
})
export class TextWithIconComponent {
  @Input() text = '';
  @Input() iconClass = '';
  @Input() iconPosition: 'prefix' | 'suffix' = 'prefix';
  @Input() displayIcon = false;
  @Input() tooltipMessage = '';
}
