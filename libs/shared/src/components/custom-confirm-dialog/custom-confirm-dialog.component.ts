import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'shared-custom-confirm-dialog',
  imports: [CommonModule, ConfirmDialogModule],
  templateUrl: './custom-confirm-dialog.component.html',
  styleUrl: './custom-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomConfirmDialogComponent {}
