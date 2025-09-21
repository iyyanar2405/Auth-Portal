import { FilterValue } from '../../models';

export const shouldApplyFilter = (
  tooltipFilters: FilterValue[],
  label: string,
) => !tooltipFilters.some((filter) => filter.label === label);
