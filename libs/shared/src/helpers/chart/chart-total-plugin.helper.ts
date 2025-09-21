export const chartTotalPlugin = (id: string) => ({
  id,
  beforeDatasetDraw(chart: any, _args: any, _pluginOpts: any) {
    const { ctx, data } = chart;

    ctx.save();
    const xCoor = chart.getDatasetMeta(0).data[0].x;
    const yCoor = chart.getDatasetMeta(0).data[0].y;
    ctx.font = '400 24px sans-serif';
    ctx.fillStyle = '#0F204B';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Total`, xCoor, yCoor - 14);

    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#003591';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      data.datasets[0].data.reduce(
        (accumulator: number, currentValue: number) =>
          accumulator + currentValue,
      ),
      xCoor,
      yCoor + 14, // 14 is the distance between the two lines
    );
  },
});
