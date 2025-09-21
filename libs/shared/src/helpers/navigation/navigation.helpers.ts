import {
  apiResponseMap,
  ApiResponseToPageNameMapping,
  AppPagesEnum,
  NavigationFiltersTypesAndValues,
  RedirectConfig,
  Routes,
} from '../../constants';
import { FilterValue } from '../../models';
import { createFilter } from '../grid';

export const constructNavigation = (
  id: string,
  type: keyof Routes,
): RedirectConfig => {
  const routesConfig: Routes = {
    auditDetails: { url: `/${AppPagesEnum.Audits}/${id}` },
    findingDetails: { url: `/${AppPagesEnum.Findings}/${id}` },
    certificateDetails: {
      url: `/${AppPagesEnum.Certificates}/${id}`,
    },
    contracts: { url: `/${AppPagesEnum.Contracts}` },
    financials: { url: `/${AppPagesEnum.Financials}` },
    scheduleList: { url: `/${AppPagesEnum.Schedule}/list` },
    settingsMembersTab: {
      url: `/${AppPagesEnum.Settings}`,
      parameters: { tab: 'members' },
    },
  };
  const filterMap: Record<string, FilterValue[]> = {
    scheduleList: [
      createFilter(
        NavigationFiltersTypesAndValues.ScheduleListTypeStatus,
        NavigationFiltersTypesAndValues.ScheduleListTypeStatusValue,
      ),
      createFilter(
        NavigationFiltersTypesAndValues.ScheduleListTypeSiteAuditId,
        `${id}`,
      ),
    ],
    contracts: [
      createFilter(
        NavigationFiltersTypesAndValues.ContractsTypeContractName,
        `${id}`,
      ),
    ],
    financials: [
      createFilter(
        NavigationFiltersTypesAndValues.FinancialsTypeInvoiceId,
        `${id}`,
      ),
    ],
  };

  const filters = filterMap[type];
  const route = routesConfig[type];
  const { url, parameters } = route;

  return {
    url,
    parameters,
    filters,
  };
};

export const mapApiResponseToPageName = (input: string): string =>
  ApiResponseToPageNameMapping[
    apiResponseMap[input] as keyof typeof ApiResponseToPageNameMapping
  ];
