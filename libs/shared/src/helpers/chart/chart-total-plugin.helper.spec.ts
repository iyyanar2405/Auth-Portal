import { chartTotalPlugin } from './chart-total-plugin.helper';

describe('chartTotalPlugin', () => {
  test('should correctly render total label and value', () => {
    // Arrange
    const id = 'testPlugin';
    const mockCtx = {
      save: jest.fn(),
      font: '',
      fillStyle: '',
      textAlign: '',
      textBaseline: '',
      fillText: jest.fn(),
    };

    const mockChart = {
      ctx: mockCtx,
      data: {
        datasets: [
          {
            data: [10, 20, 30],
          },
        ],
      },
      getDatasetMeta: jest.fn().mockReturnValue({
        data: [{ x: 50, y: 100 }],
      }),
    };

    const plugin = chartTotalPlugin(id);

    // Act
    plugin.beforeDatasetDraw(mockChart, null, null);

    // Assert
    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.font).toBe('bold 28px sans-serif');
    expect(mockCtx.fillStyle).toBe('#003591');
    expect(mockCtx.textAlign).toBe('center');
    expect(mockCtx.textBaseline).toBe('middle');

    expect(mockCtx.fillText).toHaveBeenCalledWith('Total', 50, 86);

    expect(mockCtx.fillText).toHaveBeenCalledWith(60, 50, 114);
  });

  test('should use provided plugin id', () => {
    // Arrange
    const id = 'customPluginId';
    const plugin = chartTotalPlugin(id);

    // Act

    // Assert
    expect(plugin.id).toBe(id);
  });
});
