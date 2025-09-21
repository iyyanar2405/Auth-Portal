export interface ChartFilter {
  titleFilter?: string | TrendsChartFilter;
  bodyFilter: string;
}

export interface TrendsChartFilter {
  interval: TrendsChartInterval;
  field: string;
}

export enum TrendsChartInterval {
  Year = 'year',
}
