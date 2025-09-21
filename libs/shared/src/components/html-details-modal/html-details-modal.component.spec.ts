import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { HtmlDetailsModalComponent } from './html-details-modal.component';

describe('HtmlDetailsModalComponent', () => {
  let component: HtmlDetailsModalComponent;

  const mockDynamicDialogConfig: Partial<DynamicDialogConfig> = {
    data: {
      message: 'test',
    },
  };

  beforeEach(() => {
    component = new HtmlDetailsModalComponent(
      mockDynamicDialogConfig as DynamicDialogConfig,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
