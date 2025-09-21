import {
  ApiResponseToPageNameMapping,
  AppPagesEnum,
  NavigationFiltersTypesAndValues,
} from '../../constants';
import {
  constructNavigation,
  mapApiResponseToPageName,
} from './navigation.helpers';

describe('navigation helpers', () => {
  describe('constructNavigation', () => {
    test('should construct navigation with correct output', () => {
      // Arrange
      const mockedId = '1';
      const testCases = [
        {
          mockedType: 'auditDetails',
          expectedResult: {
            url: `/${AppPagesEnum.Audits}/${mockedId}`,
          },
        },
        {
          mockedType: 'certificateDetails',
          expectedResult: {
            url: `/${AppPagesEnum.Certificates}/${mockedId}`,
          },
        },
        {
          mockedType: 'contracts',
          expectedResult: {
            url: `/${AppPagesEnum.Contracts}`,
            filters: [
              {
                label:
                  NavigationFiltersTypesAndValues.ContractsTypeContractName,
                value: [
                  {
                    label: mockedId,
                    value: mockedId,
                  },
                ],
              },
            ],
          },
        },
        {
          mockedType: 'financials',
          expectedResult: {
            url: `/${AppPagesEnum.Financials}`,
            filters: [
              {
                label: NavigationFiltersTypesAndValues.FinancialsTypeInvoiceId,
                value: [
                  {
                    label: mockedId,
                    value: mockedId,
                  },
                ],
              },
            ],
          },
        },
        {
          mockedType: 'findingDetails',
          expectedResult: {
            url: `/${AppPagesEnum.Findings}/${mockedId}`,
          },
        },
        {
          mockedType: 'settingsMembersTab',
          expectedResult: {
            url: `/${AppPagesEnum.Settings}`,
            parameters: { tab: 'members' },
          },
        },
        {
          mockedType: 'scheduleList',
          expectedResult: {
            url: `/${AppPagesEnum.Schedule}/list`,
            filters: [
              {
                label: NavigationFiltersTypesAndValues.ScheduleListTypeStatus,
                value: [
                  {
                    label:
                      NavigationFiltersTypesAndValues.ScheduleListTypeStatusValue,
                    value:
                      NavigationFiltersTypesAndValues.ScheduleListTypeStatusValue,
                  },
                ],
              },
              {
                label:
                  NavigationFiltersTypesAndValues.ScheduleListTypeSiteAuditId,
                value: [
                  {
                    label: mockedId,
                    value: mockedId,
                  },
                ],
              },
            ],
          },
        },
      ];

      testCases.forEach((testCase) => {
        // Act
        const result = constructNavigation(mockedId, testCase.mockedType);

        // Assert
        expect(result).toEqual(testCase.expectedResult);
      });
    });
  });

  describe('mapApiResponseToPageName', () => {
    test('should map API response string to internal page name or undefined if it does not exist', () => {
      // Arrange
      const testCases = [
        {
          mockedApiResponse: 'Audits management',
          expectedResult: ApiResponseToPageNameMapping.Audits,
        },
        {
          mockedApiResponse: 'Contract',
          expectedResult: ApiResponseToPageNameMapping.Contracts,
        },
        {
          mockedApiResponse: 'Certificates',
          expectedResult: ApiResponseToPageNameMapping.Certificates,
        },
        {
          mockedApiResponse: 'Enabling',
          expectedResult: ApiResponseToPageNameMapping.Members,
        },
        {
          mockedApiResponse: 'Findings management',
          expectedResult: ApiResponseToPageNameMapping.Findings,
        },
        {
          mockedApiResponse: 'Schedule',
          expectedResult: ApiResponseToPageNameMapping.Schedule,
        },
        {
          mockedApiResponse: 'Nonexistent type',
          expectedResult: undefined,
        },
      ];

      testCases.forEach((testCase) => {
        // Act
        const result = mapApiResponseToPageName(testCase.mockedApiResponse);

        // Assert
        expect(result).toEqual(testCase.expectedResult);
      });
    });
  });
});
