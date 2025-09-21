import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'shared-custom-card',
  imports: [CommonModule, CardModule, TranslocoDirective],
  templateUrl: './custom-card.component.html',
  styleUrl: './custom-card.component.scss',
})
export class CustomCardComponent {
  @Input() title!: string;
  @Input() subTitle!: string;
  @Input() customClass!: string;
  @Input() link!: string;
  @Input() imageUrl!: string;

  onCardClick(): void {
    if (this.link) {
      window.open(this.link, '_blank');
    }
  }
}
