import { FilterValue } from '../models';

export interface RedirectConfig {
  url: string;
  parameters?: Record<string, unknown>;
  filters?: FilterValue[];
}

interface Route<T extends Record<string, unknown> = Record<string, unknown>> {
  url: string;
  parameters?: T;
}

export interface Routes {
  [key: string]: Route;
}

export enum ApiResponseToPageNameMapping {
  Audits = 'auditDetails',
  Certificates = 'certificateDetails',
  Contracts = 'contracts',
  Financials = 'financials',
  Findings = 'findingDetails',
  Members = 'settingsMembersTab',
  Schedule = 'scheduleList',
}

export const apiResponseMap: Record<string, string> = {
  'Audits management': 'Audits',
  Contract: 'Contracts',
  Certificates: 'Certificates',
  Enabling: 'Members',
  'Findings management': 'Findings',
  Schedule: 'Schedule',
  Financials: 'Financials',
};

export enum NavigationFiltersTypesAndValues {
  ScheduleListTypeStatus = 'status',
  ScheduleListTypeStatusValue = 'To Be Confirmed',
  ScheduleListTypeSiteAuditId = 'siteAuditId',
  ContractsTypeContractName = 'contractName',
  FinancialsTypeInvoiceId = 'invoiceId',
}
