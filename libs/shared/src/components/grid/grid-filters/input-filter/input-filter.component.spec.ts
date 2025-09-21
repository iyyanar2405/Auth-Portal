import { DestroyRef } from '@angular/core';
import { of } from 'rxjs';

import { createDestroyRefMock } from '../../../../__mocks__';
import { InputFilterComponent } from './input-filter.component';

describe('InputFilterComponent', () => {
  const destroyRefMock: Partial<DestroyRef> = createDestroyRefMock();
  let component: InputFilterComponent;

  beforeEach(async () => {
    component = new InputFilterComponent(destroyRefMock as DestroyRef);
    component.filteringConfig$ = of({});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize search value on ngOnInit', () => {
    // Arrange
    jest.spyOn(component as any, 'initializeSearchValue');

    // Act
    component.ngOnInit();

    // Assert
    expect((component as any).initializeSearchValue).toHaveBeenCalled();
  });
});
