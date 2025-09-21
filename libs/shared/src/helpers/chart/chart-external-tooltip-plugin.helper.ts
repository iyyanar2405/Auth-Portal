import { ChartFilter, FilterValue, TrendsChartFilter } from '../../models';
import { getYearBoundsAsStrings } from '../date';

const initializeTooltipContainer = (chart: any): HTMLDivElement => {
  let tooltipContainer = chart.canvas.parentNode.querySelector(
    'div.tooltip',
  ) as HTMLDivElement;

  if (!tooltipContainer) {
    tooltipContainer = document.createElement('div');
    tooltipContainer.classList.add('tooltip');

    // Tooltip base styles
    Object.assign(tooltipContainer.style, {
      background: 'rgba(255, 255, 255, 1)',
      borderRadius: '8px',
      color: 'white',
      opacity: 1,
      position: 'absolute',
      transition: 'all .4s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      zIndex: '1000',
      pointerEvents: 'auto',
      maxWidth: '350px',
    });

    // Tooltip mouse events for opacity
    tooltipContainer.onmouseover = () => {
      tooltipContainer.style.opacity = '1';
      tooltipContainer.style.pointerEvents = 'auto';
    };

    tooltipContainer.onmouseout = () => {
      tooltipContainer.style.opacity = '0';
      tooltipContainer.style.pointerEvents = 'none';
    };

    chart.canvas.parentNode.appendChild(tooltipContainer);
  }

  return tooltipContainer;
};

const createTooltipTitle = (titleText: string): HTMLDivElement => {
  const titleContainer = document.createElement('div');
  const titleElement = document.createElement('p');
  titleElement.textContent = titleText;

  Object.assign(titleElement.style, {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#0F204B',
    marginTop: '10px',
    marginLeft: '10px',
    marginRight: '10px',
  });

  titleContainer.appendChild(titleElement);

  return titleContainer;
};

const createTooltipDataEntry = (
  label: string,
  value: string,
  color: string,
  percentage?: string,
): HTMLParagraphElement => {
  const entryContainer = document.createElement('p');
  const icon = document.createElement('span');
  const labelText = document.createElement('span');

  Object.assign(icon.style, {
    background: color,
    borderWidth: '2px',
    borderRadius: '50%',
    marginRight: '10px',
    height: '10px',
    width: '10px',
    display: 'inline-block',
  });

  Object.assign(labelText.style, {
    fontWeight: '400',
    fontSize: '16px',
    color: '#000',
  });

  const innerHTML = `${label}: <b>${value}</b>`;

  labelText.innerHTML = percentage
    ? `${innerHTML} (${percentage}%)`
    : innerHTML;

  entryContainer.appendChild(icon);
  entryContainer.appendChild(labelText);
  Object.assign(entryContainer.style, {
    display: 'block',
    marginLeft: '10px',
    marginRight: '10px',
  });

  return entryContainer;
};

const createTooltipButton = (onclick: () => void): HTMLButtonElement => {
  const button = document.createElement('button');
  // TODO translate this label
  button.textContent = 'View in list \u279C';
  Object.assign(button.style, {
    backgroundColor: '#fff',
    border: '1px solid #003591',
    color: '#003591',
    borderRadius: '10px',
    padding: '8px 12px',
    marginTop: '4px',
    marginBottom: '10px',
    marginLeft: '10px',
    marginRight: '10px',
    fontFamily: 'Nunito Sans',
    fontSize: '14px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  });

  button.onclick = onclick;

  return button;
};

const getBodyTextAndLabel = (
  chart: any,
  tooltip: any,
  index: number,
  customTitle?: string,
) => {
  let bodyText = tooltip.body[index]?.lines?.join(', ') || '';
  let label = customTitle ? tooltip.title[index] : '';

  const scales = chart.config.options?.scales;
  const hasTwoAxes = scales && Object.keys(scales).length === 2;

  if (hasTwoAxes) {
    const lastColonIndex = bodyText.lastIndexOf(':');

    if (lastColonIndex !== -1) {
      [label, bodyText] = [
        bodyText.slice(0, lastColonIndex).trim(),
        bodyText.slice(lastColonIndex + 1).trim(),
      ];
    }
  }

  return {
    label,
    bodyText,
  };
};

const extractTitleFilterValues = (
  title: string[],
  titleFilter: string | TrendsChartFilter | undefined,
  bodyFilter: string,
): FilterValue[] => {
  const titleValue = title[0];

  if (!titleFilter || typeof titleFilter === 'string') {
    return titleValue
      ? [
          {
            label: titleFilter || bodyFilter,
            value: [{ label: titleValue, value: titleValue }],
          },
        ]
      : [];
  }

  if ('field' in titleFilter) {
    const { firstDay, lastDay } = getYearBoundsAsStrings(titleValue);

    return [
      {
        label: titleFilter.field,
        value: [
          { label: firstDay, value: firstDay },
          { label: lastDay, value: lastDay },
        ],
      },
    ];
  }

  return [];
};

const extractBodyFilterValues = (
  body: { lines: string[] }[],
  titleFilter: string | TrendsChartFilter | undefined,
  bodyFilter: string,
): FilterValue[] => {
  if (!titleFilter) return [];

  return body.flatMap(({ lines }) =>
    lines.map((line) => {
      const label = line.substring(0, line.lastIndexOf(':'));

      return { label: bodyFilter, value: [{ label, value: label }] };
    }),
  );
};

export const handleTooltipButtonClick = (
  tooltip: { title: string[]; body: { lines: string[] }[] },
  chartFilters: ChartFilter,
  onTooltipButtonClick: (data: FilterValue[]) => void,
): void => {
  if (!onTooltipButtonClick) return;

  const { bodyFilter, titleFilter } = chartFilters;
  const { title, body } = tooltip;

  const titleFilterValues = extractTitleFilterValues(
    title,
    titleFilter,
    bodyFilter,
  );

  const bodyFilterValues = extractBodyFilterValues(
    body,
    titleFilter,
    bodyFilter,
  );

  const filterValues = [...bodyFilterValues, ...titleFilterValues];

  onTooltipButtonClick(filterValues);
};

const computeHorizontalPosition = (
  eventX: number,
  tooltipWidth: number,
  canvasWidth: number,
): number => {
  const HORIZONTAL_TOOLTIP_OFFSET = 30;

  if (eventX + tooltipWidth > canvasWidth) {
    return canvasWidth - tooltipWidth - HORIZONTAL_TOOLTIP_OFFSET;
  }

  return eventX + HORIZONTAL_TOOLTIP_OFFSET / 2;
};

const computeVerticalPosition = (
  eventY: number,
  tooltipHeight: number,
  canvasHeight: number,
  legendSectionHeight: number,
): { alignOnTop: boolean; coordinateTop: number } => {
  const VERTICAL_TOOLTIP_OFFSET = 15;

  if (eventY + tooltipHeight > canvasHeight) {
    return { alignOnTop: false, coordinateTop: 0 };
  }

  return {
    alignOnTop: true,
    coordinateTop: legendSectionHeight + eventY + VERTICAL_TOOLTIP_OFFSET,
  };
};

const buildTooltipStyle = (
  coordinateLeft: number,
  coordinateTop: number,
  alignOnTop: boolean,
  options: any,
): Partial<CSSStyleDeclaration> => {
  const { bodyFont, padding } = options;

  const style: Partial<CSSStyleDeclaration> = {
    opacity: '1',
    left: `${coordinateLeft}px`,
    font: bodyFont.string,
    padding: `${padding}px`,
  };

  if (alignOnTop) {
    style.top = `${coordinateTop}px`;
    style.bottom = '';
  } else {
    style.bottom = '0';
    style.top = '';
  }

  return style;
};

const positionTooltip = (
  tooltipContainer: HTMLElement,
  chart: any,
  tooltip: any,
) => {
  const { clientWidth: tooltipWidth, clientHeight: tooltipHeight } =
    tooltipContainer;

  const { canvas } = chart;

  const { offsetWidth: canvasWidth, offsetHeight: canvasHeight } = canvas;

  const { _eventPosition: eventPosition, options } = tooltip;

  const canvasRect = canvas.getBoundingClientRect();
  const containerRect = tooltipContainer.offsetParent?.getBoundingClientRect();
  const legendSectionHeight = canvasRect.top - (containerRect?.top || 0);

  const coordinateLeft = computeHorizontalPosition(
    eventPosition.x,
    tooltipWidth,
    canvasWidth,
  );
  const { alignOnTop, coordinateTop } = computeVerticalPosition(
    eventPosition.y,
    tooltipHeight,
    canvasHeight,
    legendSectionHeight,
  );

  const style = buildTooltipStyle(
    coordinateLeft,
    coordinateTop,
    alignOnTop,
    options,
  );

  Object.assign(tooltipContainer.style, style);
};

export const externalTooltipPlugin = (
  context: any,
  onTooltipButtonClick: (data: any) => void,
  chartFilters: ChartFilter,
  customTitle?: string,
  shouldShowPercentage?: boolean,
) => {
  const { chart, tooltip } = context;
  const tooltipContainer = initializeTooltipContainer(chart);

  if (tooltip.opacity === 0) {
    tooltipContainer.style.opacity = '0';

    return;
  }

  tooltipContainer.style.pointerEvents = 'auto';
  tooltipContainer.innerHTML = '';

  const titleText = customTitle || (tooltip.title && tooltip.title.join(', '));

  if (titleText) {
    tooltipContainer.appendChild(createTooltipTitle(titleText));
  }

  if (tooltip.body) {
    tooltip.body.forEach((_bodyItem: string, index: number) => {
      const labelColor = tooltip.labelColors[index].backgroundColor;
      const { label, bodyText } = getBodyTextAndLabel(
        chart,
        tooltip,
        index,
        customTitle,
      );

      let dataEntry: HTMLParagraphElement;

      if (shouldShowPercentage) {
        const percentage = context.chart.config.data.percentageValues[label];

        dataEntry = createTooltipDataEntry(
          label,
          bodyText,
          labelColor,
          percentage,
        );
      } else {
        dataEntry = createTooltipDataEntry(label, bodyText, labelColor);
      }

      tooltipContainer.appendChild(dataEntry);
    });

    const button = createTooltipButton(() =>
      handleTooltipButtonClick(tooltip, chartFilters, onTooltipButtonClick),
    );

    tooltipContainer.appendChild(button);
  }

  positionTooltip(tooltipContainer, chart, tooltip);
};

export const exportedForTesting = {
  createTooltipTitle,
  createTooltipDataEntry,
  createTooltipButton,
  getBodyTextAndLabel,
  handleTooltipButtonClick,
  positionTooltip,
};
