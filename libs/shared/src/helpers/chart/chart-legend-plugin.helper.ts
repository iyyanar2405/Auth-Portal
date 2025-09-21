import { Chart, LegendItem } from 'chart.js';

import { ChartTypeEnum } from '../../models/chart/chart-type.enum';

const getOrCreateLegendList = (legendId: string): HTMLUListElement => {
  const legendContainer = document.getElementById(legendId);
  let listContainer = legendContainer?.querySelector('ul') as HTMLUListElement;

  if (!listContainer) {
    listContainer = document.createElement('ul');
    Object.assign(listContainer.style, {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '0 0 0 24px',
      margin: '0 0 0 0',
    });
    legendContainer?.appendChild(listContainer);
  }

  return listContainer;
};

const toggleVisibility = (chart: Chart, item: any) => {
  const chartConfig = chart.config as any;
  const { index, datasetIndex } = item;

  const isPieOrDoughnut = [ChartTypeEnum.Pie, ChartTypeEnum.Doughnut].includes(
    chartConfig.type,
  );

  if (isPieOrDoughnut) {
    chart.toggleDataVisibility(index);
  } else {
    const isVisible = chart.isDatasetVisible(datasetIndex);
    chart.setDatasetVisibility(datasetIndex, !isVisible);
  }
};

const createLegendItem = (item: LegendItem, chart: Chart): HTMLLIElement => {
  if (item.datasetIndex === undefined) return document.createElement('li');

  const { datasetIndex } = item;
  const isVisible = chart.isDatasetVisible(datasetIndex);

  const li = document.createElement('li');
  Object.assign(li.style, {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '4px 10px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '10px',
    borderColor: isVisible ? '#99D9F0' : '#CBCAC8',
    backgroundColor: isVisible ? '#FFFFFF' : '#F3F2F2',
  });

  const boxSpan = document.createElement('span');
  Object.assign(boxSpan.style, {
    backgroundColor: isVisible ? item.fillStyle : '#F3F2F2',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: isVisible ? item.fillStyle : '#696763',
    display: 'inline-block',
    flexShrink: '0',
    height: '8px',
    marginRight: '10px',
    width: '8px',
    opacity: isVisible ? '1' : '0.5',
    borderRadius: '50%',
  });

  const textContainer = document.createElement('p');
  Object.assign(textContainer.style, {
    color: isVisible ? '#000000' : '#696763',
    fontWeight: '400',
    userSelect: 'none',
  });

  textContainer.textContent = item.text;

  li.append(boxSpan, textContainer);

  return li;
};

const toggleDatasetVisibility = (label: string, charts: Chart[]) => {
  charts.forEach((chart) => {
    chart.data.datasets.forEach((dataset, index) => {
      if (dataset.label === label) {
        toggleVisibility(chart, { datasetIndex: index });
        chart.update();
      }
    });
  });
};

const updateLegendItems = (legendId: string, charts: Chart[]) => {
  if (charts.length === 0) return;

  const ul = getOrCreateLegendList(legendId);

  ul.innerHTML = '';

  const uniqueLabels = new Set<string>();

  charts.forEach((chart) => {
    const generateLabelsCallback =
      chart.options.plugins?.legend?.labels?.generateLabels;

    if (generateLabelsCallback) {
      const items = generateLabelsCallback(chart) || [];

      items.forEach((item: LegendItem) => {
        const { text } = item;

        if (!uniqueLabels.has(text)) {
          uniqueLabels.add(text);

          const legendItem = createLegendItem(item, chart);

          legendItem.onclick = () => toggleDatasetVisibility(text, charts);

          ul.appendChild(legendItem);
        }
      });
    }
  });
};

/**
 * Chart.js plugin to render a custom HTML legend.
 * @param legendId The id for the legend container.
 * @returns The plugin object.
 */
export const createHtmlLegendPlugin = (legendId: string) => ({
  id: legendId,
  afterUpdate(chart: Chart) {
    updateLegendItems(legendId, [chart]);
  },
});

/**
 * Creates or updates the legend for multiple charts.
 * @param legendId The id for the legend container.
 * @param charts The array of charts that need their legends updated.
 */
export const createOrUpdateLegendForCharts = (
  legendId: string,
  chartComponents: any[],
): void => {
  const chartInstances = chartComponents.map((component) => component.chart);
  updateLegendItems(legendId, chartInstances);
};
