export interface GridRowAction {
  id: number;
  isRead: boolean;
  actionName: string;
  entityType: string;
  iconTooltip: {
    displayIcon: boolean;
    iconClass: string;
    iconPosition: string;
    tooltipMessage: string;
  };
  title: string;
  message: string;
  receivedOn: string;
  actions: {
    actionType: string;
    iconClass: string;
    label: string;
    url: string;
  }[];
}
