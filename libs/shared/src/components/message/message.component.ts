import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';

import { MessageModel, MessageSeverity } from './message.model';

@Component({
  selector: 'shared-message',
  imports: [CommonModule, MessagesModule, ButtonModule, TranslocoDirective],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input()
  messages: MessageModel[] = [];

  @Input()
  hasProjectedButton = false;

  get MessageSeverity() {
    return MessageSeverity;
  }

  onCloseNotification(i: number) {
    this.messages = this.messages.filter((m, index) => index !== i);
  }

  messageTrackBy(index: number, message: MessageModel): string {
    return message.detail + message.severity;
  }
}
