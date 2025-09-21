import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { createDynamicDialogRefServiceMock } from '../../__mocks__';
import { HtmlDetailsFooterModalComponent } from './html-details-footer-modal.component';

describe('HtmlDetailsFooterModalComponent', () => {
  let component: HtmlDetailsFooterModalComponent;
  const refMock: Partial<DynamicDialogRef> =
    createDynamicDialogRefServiceMock();

  beforeEach(async () => {
    component = new HtmlDetailsFooterModalComponent(
      refMock as DynamicDialogRef,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
