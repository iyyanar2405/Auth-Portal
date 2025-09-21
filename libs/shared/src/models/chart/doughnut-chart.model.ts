import { ExtendedChartData } from '../extended-chart-data.model';
import { ChartTypeEnum } from './chart-type.enum';

export interface DoughnutChartModel {
  data: ExtendedChartData<ChartTypeEnum.Doughnut>;
}
