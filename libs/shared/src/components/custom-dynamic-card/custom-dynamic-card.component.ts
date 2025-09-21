import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabViewModule } from 'primeng/tabview';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

import {
  CardDataModel,
  CardDetails,
  CardNavigationPayload,
} from '../../models';

@Component({
  selector: 'shared-custom-dynamic-card',
  imports: [
    CommonModule,
    TranslocoDirective,
    VirtualScrollerModule,
    TabViewModule,
    ButtonModule,
    ProgressBarModule,
  ],
  templateUrl: './custom-dynamic-card.component.html',
  styleUrl: './custom-dynamic-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedCustomDynamicCardComponent {
  @Input() card!: CardDataModel;
  activeTabIndex = 1;
  @Output() cardClicked = new EventEmitter<CardNavigationPayload>();

  changeActiveTabIndex(tabIndex: number): void {
    this.activeTabIndex = tabIndex;
  }

  onCardClick(cardDetail: CardDetails): void {
    const {
      cardData: { service, yearlyData },
    } = this.card;

    const { label: year } = yearlyData[this.activeTabIndex].year;
    const { entity } = cardDetail;

    const payload: CardNavigationPayload = {
      service,
      year,
      entity: entity.toLowerCase(),
    };

    this.cardClicked.emit(payload);
  }

  getYearLabel(service: string, label: string): string {
    return `${service} ${label}`;
  }

  get shouldDisplayNoData(): boolean {
    return this.isCardDataEmpty() || this.hasOnlyZeroValues();
  }

  private isCardDataEmpty(): boolean {
    const details = this.card.cardData.yearlyData[this.activeTabIndex]?.details;

    return !details || details.length === 0;
  }

  private hasOnlyZeroValues(): boolean {
    const details =
      this.card.cardData.yearlyData[this.activeTabIndex]?.details || [];

    return details.every(
      (item) => item.stats.currentValue === 0 && item.stats.currentValue === 0,
    );
  }
}
