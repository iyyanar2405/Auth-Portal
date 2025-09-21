import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { ChartData, ChartEvent, ChartType, Plugin } from 'chart.js';
import { Chart } from 'chart.js/auto';

import { createHtmlLegendPlugin, externalTooltipPlugin } from '../../helpers';
import { ChartFilter, ChartTypeEnum } from '../../models';
import { EmptyChartComponent } from './empty-chart/empty-chart.component';

let chartInstanceId = 0;

@Component({
  selector: 'shared-chart',
  imports: [CommonModule, EmptyChartComponent],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnDestroy, AfterViewInit {
  private _data!: ChartData | null;
  private dataIsLoaded = false;

  chart!: Chart;

  hasData!: boolean;

  @Input()
  set data(value: ChartData | null) {
    this.hasData = !!value && value.datasets?.length > 0;

    if (!value) {
      return;
    }

    this._data = { ...value };

    if (this.chart) {
      this.updateChart();
    } else {
      this.dataIsLoaded = true;
    }
  }

  @Input() options!: any;
  @Input() type: ChartType = ChartTypeEnum.Bar;
  @Input() plugins: Plugin[] = [];
  @Input() useCustomLegend = false;
  @Input() hasBorderIfNoData = false;
  @Input() tooltipTitle!: string;
  @Input() chartFilters!: ChartFilter;
  @Output() chartClick = new EventEmitter<any>();
  @Output() tooltipButtonClick = new EventEmitter<any>();

  @ViewChild('chartCanvas', { static: false })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  // eslint-disable-next-line no-plusplus
  legendId = `legend-container-${chartInstanceId++}`;

  ngAfterViewInit(): void {
    if (this.dataIsLoaded && this.chartCanvas) {
      this.initChart();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private initChart(): void {
    const tooltipClickCallback = (data: any) => {
      this.tooltipButtonClick.emit(data);
    };

    const configureTooltipPlugin = (context: any): void => {
      const isDoughnut = this.type === ChartTypeEnum.Doughnut;
      externalTooltipPlugin(
        context,
        tooltipClickCallback,
        this.chartFilters,
        isDoughnut ? this.tooltipTitle : undefined,
        isDoughnut,
      );
    };

    const tooltipPlugin = {
      enabled: false,
      external: configureTooltipPlugin,
    };

    const chartPlugins = this.useCustomLegend
      ? [...this.plugins, createHtmlLegendPlugin(this.legendId)]
      : [...this.plugins];

    const chartConfig: any = {
      type: this.type,
      data: this._data,
      options: {
        ...this.options,
        responsive: true,
        onClick: (_: ChartEvent, elements: Array<unknown>) => {
          if (elements.length > 0) {
            this.chartClick.emit(elements[0]);
          }
        },
        plugins: {
          ...this.options?.plugins,
          tooltip: {
            ...tooltipPlugin,
            titleFont: {
              family: 'Nunito Sans',
            },
            bodyFont: {
              family: 'Nunito Sans',
            },
          },
          htmlLegend: {
            containerID: this.legendId,
          },
        },
      },
      plugins: chartPlugins,
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, chartConfig);
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.data = this._data!;
      this.chart.update();
    }
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
