export interface CardDataModel {
  cardData: {
    service: string;
    yearlyData: YearlyCardData[];
  };
}

export interface YearlyCardData {
  year: YearLabel;
  details: CardDetails[];
}

export interface YearLabel {
  label: string;
  index: number;
}

export interface CardDetails {
  entity: string;
  entityTranslationKey: string;
  stats: CardStats;
}

export interface CardStats {
  currentValue: number;
  maxValue: number;
  percentage: number;
}
