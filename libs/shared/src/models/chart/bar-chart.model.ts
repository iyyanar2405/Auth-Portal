import { ChartData } from 'chart.js';

import { ChartTypeEnum } from './chart-type.enum';

export interface BarChartModel {
  data: ChartData<ChartTypeEnum.Bar>;
}
