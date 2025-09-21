import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { ChartType } from 'chart.js';

import { ChartTypeEnum } from '../../../models';

@Component({
  selector: 'shared-empty-chart',
  imports: [CommonModule, TranslocoDirective],
  templateUrl: './empty-chart.component.html',
  styleUrl: './empty-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyChartComponent {
  @Input({ required: true }) type: ChartType = ChartTypeEnum.Bar;
  @Input() hasBorderIfNoData = false;

  chartTypeEnum = ChartTypeEnum;
}
