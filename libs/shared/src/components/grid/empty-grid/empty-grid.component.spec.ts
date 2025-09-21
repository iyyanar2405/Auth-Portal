import { EmptyGridComponent } from './empty-grid.component';

describe('EmptyGridComponent', () => {
  let component: EmptyGridComponent;

  beforeEach(async () => {
    component = new EmptyGridComponent();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
