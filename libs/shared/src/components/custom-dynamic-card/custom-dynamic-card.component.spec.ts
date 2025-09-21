import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { createTranslationServiceMock } from '../../__mocks__';
import { SharedCustomDynamicCardComponent } from './custom-dynamic-card.component';

describe('SharedCustomDynamicCardComponent', () => {
  let component: SharedCustomDynamicCardComponent;
  let fixture: ComponentFixture<SharedCustomDynamicCardComponent>;
  let translocoService: Partial<TranslocoService>;

  beforeEach(() => {
    translocoService = createTranslationServiceMock();

    TestBed.configureTestingModule({
      imports: [SharedCustomDynamicCardComponent],
      providers: [
        {
          provide: TranslocoService,
          useValue: translocoService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedCustomDynamicCardComponent);
    component = fixture.componentInstance;
  });

  test('should update card data on @Input() set card', () => {
    // Arrange
    const mockedCardData = {
      cardData: {
        service: 'ISO 9001: 20115',
        data: [
          {
            year: {
              label: '2024',
              index: 0,
            },
            info: [
              {
                name: 'Schedule',
                values: {
                  currentValue: 35,
                  maxValue: 50,
                },
                drawValue: 70,
                textInfo: 'overview.cardTexts.schedule',
              },
              {
                name: 'Audit',
                values: {
                  currentValue: 10,
                  maxValue: 100,
                },
                drawValue: 10,
                textInfo: 'overview.cardTexts.audits',
              },
              {
                name: 'Findings',
                values: {
                  currentValue: 35,
                  maxValue: 40,
                },
                drawValue: 87.5,
                textInfo: 'overview.cardTexts.findings',
              },
            ],
          },
          {
            year: {
              label: '2025',
              index: 1,
            },
            info: [
              {
                name: 'Schedule',
                values: {
                  currentValue: 11,
                  maxValue: 22,
                },
                drawValue: 50,
                textInfo: 'overview.cardTexts.schedule',
              },
              {
                name: 'Audit',
                values: {
                  currentValue: 55,
                  maxValue: 100,
                },
                drawValue: 55,
                textInfo: 'overview.cardTexts.audits',
              },
              {
                name: 'Findings',
                values: {
                  currentValue: 3,
                  maxValue: 40,
                },
                drawValue: 7.5,
                textInfo: 'overview.cardTexts.findings',
              },
            ],
          },
          {
            year: {
              label: '2026',
              index: 2,
            },
            info: [
              {
                name: 'Schedule',
                values: {
                  currentValue: 7,
                  maxValue: 50,
                },
                drawValue: 14,
                textInfo: 'overview.cardTexts.schedule',
              },
              {
                name: 'Audit',
                values: {
                  currentValue: 32,
                  maxValue: 56,
                },
                drawValue: 57.142857142857146,
                textInfo: 'overview.cardTexts.audits',
              },
              {
                name: 'Findings',
                values: {
                  currentValue: 5,
                  maxValue: 5,
                },
                drawValue: 100,
                textInfo: 'overview.cardTexts.findings',
              },
            ],
          },
        ],
      },
    };

    // Act
    fixture.componentRef.setInput('card', mockedCardData);

    // Assert
    expect(component.card).toEqual(mockedCardData);
  });

  test('should change active tab index', () => {
    // Arrange
    const tabIndex = 2;

    // Act
    component.changeActiveTabIndex(tabIndex);

    // Assert
    expect(component.activeTabIndex).toBe(tabIndex);
  });

  describe('shouldDisplayNoData', () => {
    beforeEach(() => {
      component.activeTabIndex = 0;
    });

    test('should return true when details is undefined', () => {
      // Arrange
      component.card = {
        cardData: {
          yearlyData: [
            {
              details: undefined,
            },
          ],
        },
      } as any;

      // Assert
      expect(component.shouldDisplayNoData).toBe(true);
    });

    test('should return true when details is empty', () => {
      // Arrange
      component.card = {
        cardData: {
          service: 'ISO C',
          yearlyData: [
            {
              year: { label: '2023', index: 0 },
              details: [],
            },
          ],
        },
      };

      // Assert
      expect(component.shouldDisplayNoData).toBe(true);
    });

    test('should return true when all values are zero', () => {
      // Arrange
      component.card = {
        cardData: {
          service: 'ISO C',
          yearlyData: [
            {
              year: { label: '2023', index: 0 },
              details: [
                {
                  entity: 'Audits',
                  stats: { currentValue: 0, maxValue: 0, percentage: 0 },
                  entityTranslationKey: 'Audits',
                },
              ],
            },
          ],
        },
      };

      // Assert
      expect(component.shouldDisplayNoData).toBe(true);
    });

    test('should return false when at least one value is non-zero', () => {
      // Arrange
      component.card = {
        cardData: {
          service: 'ISO C',
          yearlyData: [
            {
              year: { label: '2023', index: 0 },
              details: [
                {
                  entity: 'Audits',
                  stats: { currentValue: 5, maxValue: 10, percentage: 50 },
                  entityTranslationKey: 'entityTranslationKey',
                },
              ],
            },
          ],
        },
      };

      // Assert
      expect(component.shouldDisplayNoData).toBe(false);
    });
  });
});
