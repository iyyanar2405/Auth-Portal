import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { 
  SharedButtonComponent, 
  SharedButtonType 
} from '@customer-portal/shared';

@Component({
  selector: 'customer-portal-support-box',
  standalone: true,
  imports: [CommonModule, TranslocoDirective, SharedButtonComponent],
  templateUrl: './support-box.component.html',
  styleUrls: ['./support-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportBoxComponent {
  sharedButtonType = SharedButtonType;
}