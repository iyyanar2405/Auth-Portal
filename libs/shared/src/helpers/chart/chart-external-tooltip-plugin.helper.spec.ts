import { ChartFilter } from '../../models';
import { exportedForTesting } from './chart-external-tooltip-plugin.helper';

describe('Tooltip Helper Functions', () => {
  describe('createTooltipTitle', () => {
    test('should create a title element with the given text', () => {
      // Arrange
      const titleText = 'Test Title';

      // Act
      const titleContainer = exportedForTesting.createTooltipTitle(titleText);

      // Assert
      expect(titleContainer).toBeTruthy();
      expect(titleContainer.querySelector('p')?.textContent).toBe(titleText);
    });
  });

  describe('createTooltipDataEntry', () => {
    test('should create a data entry with the correct label, value, and color', () => {
      // Arrange
      const label = 'Label';
      const value = '100';
      const color = 'red';

      // Act
      const entry = exportedForTesting.createTooltipDataEntry(
        label,
        value,
        color,
      );

      // Assert
      expect(entry).toBeTruthy();
      expect(entry.querySelector('span')?.style.background).toBe(color);
      expect(entry.innerHTML).toContain(`<b>${value}</b>`);
    });

    test('should add percentage if provided', () => {
      // Arrange
      const label = 'Label';
      const value = '100';
      const color = 'blue';
      const percentage = '50';

      // Act
      const entry = exportedForTesting.createTooltipDataEntry(
        label,
        value,
        color,
        percentage,
      );

      // Assert
      expect(entry).toBeTruthy();
      expect(entry.innerHTML).toContain(`(${percentage}%)`);
    });
  });

  describe('createTooltipButton', () => {
    test('should create a button with the correct label and onclick handler', () => {
      // Arrange
      const onClickMock = jest.fn();

      // Act
      const button = exportedForTesting.createTooltipButton(onClickMock);

      // Assert
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('View in list \u279C');
      button.click();
      expect(onClickMock).toHaveBeenCalled();
    });
  });

  describe('getBodyTextAndLabel', () => {
    test('should return correct bodyText and label when customTitle is provided', () => {
      // Arrange
      const chart = { config: { options: { scales: {} } } };
      const tooltip = {
        body: [{ lines: ['value1'] }],
        title: ['Custom Title'],
      };
      const index = 0;
      const customTitle = 'Custom Title';

      // Act
      const result = exportedForTesting.getBodyTextAndLabel(
        chart,
        tooltip,
        index,
        customTitle,
      );

      // Assert
      expect(result.label).toBe('Custom Title');
      expect(result.bodyText).toBe('value1');
    });

    test('should return an empty label when customTitle is not provided', () => {
      // Arrange
      const chart = { config: { options: { scales: {} } } };
      const tooltip = {
        body: [{ lines: ['value1'] }],
        title: ['Custom Title'],
      };
      const index = 0;

      // Act
      const result = exportedForTesting.getBodyTextAndLabel(
        chart,
        tooltip,
        index,
      );

      // Assert
      expect(result.label).toBe('');
      expect(result.bodyText).toBe('value1');
    });

    test('should parse bodyText and label correctly when there are two axes in the chart', () => {
      // Arrange
      const chart = { config: { options: { scales: { x: {}, y: {} } } } };
      const tooltip = {
        body: [{ lines: ['Category: 1998: 100'] }],
        title: ['Some Title'],
      };
      const index = 0;

      // Act
      const result = exportedForTesting.getBodyTextAndLabel(
        chart,
        tooltip,
        index,
      );

      // Assert
      expect(result.label).toBe('Category: 1998');
      expect(result.bodyText).toBe('100');
    });

    test('should not modify label or bodyText when there are no two axes in the chart', () => {
      // Arrange
      const chart = { config: { options: { scales: {} } } };
      const tooltip = { body: [{ lines: ['value1'] }], title: ['Some Title'] };
      const index = 0;

      // Act
      const result = exportedForTesting.getBodyTextAndLabel(
        chart,
        tooltip,
        index,
      );

      // Assert
      expect(result.label).toBe('');
      expect(result.bodyText).toBe('value1');
    });

    test('should return empty bodyText when lines are empty', () => {
      // Arrange
      const chart = { config: { options: { scales: {} } } };
      const tooltip = { body: [{ lines: [] }], title: ['Some Title'] };
      const index = 0;

      // Act
      const result = exportedForTesting.getBodyTextAndLabel(
        chart,
        tooltip,
        index,
      );

      // Assert
      expect(result.bodyText).toBe('');
    });

    test('should return empty bodyText when lines are undefined', () => {
      // Arrange
      const chart = { config: { options: { scales: {} } } };
      const tooltip = { body: [{}], title: ['Some Title'] };
      const index = 0;

      // Act
      const result = exportedForTesting.getBodyTextAndLabel(
        chart,
        tooltip,
        index,
      );

      // Assert
      expect(result.bodyText).toBe('');
    });

    test('should return correct bodyText and label when chart scales is undefined', () => {
      // Arrange
      const chart = { config: { options: {} } }; // scales is undefined
      const tooltip = {
        body: [{ lines: ['value1'] }],
        title: ['Custom Title'],
      };
      const index = 0;
      const customTitle = 'Custom Title';

      // Act
      const result = exportedForTesting.getBodyTextAndLabel(
        chart,
        tooltip,
        index,
        customTitle,
      );

      // Assert
      expect(result.label).toBe('Custom Title');
      expect(result.bodyText).toBe('value1');
    });
  });

  describe('handleTooltipButtonClick', () => {
    let chartFilters: ChartFilter;
    let onClickMock: jest.Mock;

    beforeEach(() => {
      // Arrange
      chartFilters = { bodyFilter: 'body', titleFilter: 'title' };
      onClickMock = jest.fn();
    });

    test('should call onTooltipButtonClick with the correct filter values', () => {
      // Arrange
      const tooltip = {
        title: ['Title'],
        body: [{ lines: ['Label:50:100'] }],
      };

      // Act
      exportedForTesting.handleTooltipButtonClick(
        tooltip,
        chartFilters,
        onClickMock,
      );

      // Assert
      expect(onClickMock).toHaveBeenCalled();
      expect(onClickMock).toHaveBeenCalledWith([
        { label: 'body', value: [{ label: 'Label:50', value: 'Label:50' }] },
        { label: 'title', value: [{ label: 'Title', value: 'Title' }] },
      ]);
    });
  });

  describe('positionTooltip', () => {
    let tooltipContainer: HTMLElement;
    let chart: any;
    let tooltip: any;

    beforeEach(() => {
      // Arrange
      tooltipContainer = document.createElement('div');
      chart = {
        canvas: {
          offsetWidth: 1000,
          offsetHeight: 600,
          getBoundingClientRect: jest.fn(() => ({
            top: 100,
            left: 50,
            width: 1000,
            height: 600,
            bottom: 700,
            right: 1050,
          })),
        },
      };
      tooltip = {
        _eventPosition: { x: 10, y: 5 },
        options: { bodyFont: { string: 'font' }, padding: 5 },
      };
      Object.defineProperties(tooltipContainer, {
        clientWidth: { value: 180 },
        clientHeight: { value: 80 },
      });
    });

    test('positions tooltip on the top left quadrant', () => {
      // Arrange
      tooltip._eventPosition.x = 100;
      tooltip._eventPosition.y = 50;

      // Act
      exportedForTesting.positionTooltip(tooltipContainer, chart, tooltip);

      // Assert
      expect(tooltipContainer.style.left).toBe('115px');
      expect(tooltipContainer.style.top).toBe('165px');
    });

    test('positions tooltip on the top right quadrant', () => {
      // Arrange
      tooltip._eventPosition.x = 960;
      tooltip._eventPosition.y = 50;

      // Act
      exportedForTesting.positionTooltip(tooltipContainer, chart, tooltip);

      // Assert
      expect(tooltipContainer.style.left).toBe('790px');
      expect(tooltipContainer.style.top).toBe('165px');
    });

    test('positions tooltip on the bottom left quadrant', () => {
      // Arrange
      tooltip._eventPosition.x = 100;
      tooltip._eventPosition.y = 550;

      // Act
      exportedForTesting.positionTooltip(tooltipContainer, chart, tooltip);

      // Assert
      expect(tooltipContainer.style.left).toBe('115px');
      expect(tooltipContainer.style.bottom).toBe('0px');
      expect(tooltipContainer.style.top).toBe('');
    });

    test('positions tooltip on the bottom right quadrant', () => {
      // Arrange
      tooltip._eventPosition.x = 960;
      tooltip._eventPosition.y = 550;

      // Act
      exportedForTesting.positionTooltip(tooltipContainer, chart, tooltip);

      // Assert
      expect(tooltipContainer.style.left).toBe('790px');
      expect(tooltipContainer.style.bottom).toBe('0px');
      expect(tooltipContainer.style.top).toBe('');
    });

    test('applies font and padding styles correctly', () => {
      // Act
      exportedForTesting.positionTooltip(tooltipContainer, chart, tooltip);

      // Assert
      expect(tooltipContainer.style.font).toBe('font');
      expect(tooltipContainer.style.padding).toBe('5px');
    });
  });
});
