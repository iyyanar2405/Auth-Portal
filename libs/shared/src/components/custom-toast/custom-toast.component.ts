import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'shared-custom-toast',
  imports: [CommonModule, ToastModule],
  templateUrl: './custom-toast.component.html',
  styleUrl: './custom-toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomToastComponent {
  // TODO: remove this after toast is used
  // This is how the toasts will be used in the parent component
  // this.messageService.add(getToastContentBySeverity(ToastSeverity.error));
}
