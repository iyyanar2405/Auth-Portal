import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'auth-portal-support-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support-box.component.html',
  styleUrls: ['./support-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportBoxComponent {
  supportEmail = 'support@example.com';
  supportPhone = '+1-800-123-4567';
}