import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { NOTIFICATION_HELP_SUPPORT } from '../../constants/notification-help.constant';
import { HelpClickedModal } from '../../models';
import { SharedButtonComponent, SharedButtonType } from '../button';

@Component({
  selector: 'shared-html-details-footer-modal',
  imports: [CommonModule, TranslocoDirective, SharedButtonComponent],
  templateUrl: './html-details-footer-modal.component.html',
  styleUrl: './html-details-footer-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlDetailsFooterModalComponent implements OnDestroy {
  sharedButtonType = SharedButtonType;

  constructor(private ref: DynamicDialogRef) {}

  closeDialog(data: boolean): void {
    this.ref.close(data);
  }

  onHelpClick(): void {
    const helpClicked: HelpClickedModal = {
      action: NOTIFICATION_HELP_SUPPORT.NotificationHelp,
    };
    this.ref.close(helpClicked);
  }

  ngOnDestroy(): void {
    this.ref.close();
  }
}
