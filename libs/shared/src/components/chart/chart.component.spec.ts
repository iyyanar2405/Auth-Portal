import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;

  beforeEach(() => {
    component = new ChartComponent();
    component.options = {
      plugins: {},
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
