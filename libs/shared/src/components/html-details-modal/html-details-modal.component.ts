import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'shared-html-details-modal',
  imports: [CommonModule],
  templateUrl: './html-details-modal.component.html',
  styleUrl: './html-details-modal.component.scss',
})
export class HtmlDetailsModalComponent {
  constructor(public config: DynamicDialogConfig) {}
}
