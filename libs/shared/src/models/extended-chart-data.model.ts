import { ChartData, ChartTypeRegistry } from 'chart.js';

export interface ExtendedChartData<T extends keyof ChartTypeRegistry>
  extends ChartData<T> {
  percentageValues?: { [key: string]: number };
}
