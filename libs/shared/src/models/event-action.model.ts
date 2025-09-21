export interface EventAction {
  id: number | string;
  displayConfirmedLabel?: boolean;
  displayConfirmButton?: boolean;
  actions?: EventActionItem[];
}

export interface EventActionItem {
  label: string;
  i18nKey?: string;
  icon: string;
  disabled?: boolean;
  command?: any;
}
