import { ListboxChangeEvent } from 'primeng/listbox';
import { TriStateCheckboxChangeEvent } from 'primeng/tristatecheckbox';
import { of } from 'rxjs';

import { CheckboxFilterComponent } from './checkbox-filter.component';

describe('CheckboxFilterComponent', () => {
  let component: CheckboxFilterComponent;

  beforeEach(async () => {
    component = new CheckboxFilterComponent();
    component.options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    component.filteringConfig$ = of({}); // replace with actual filtering config if needed
  });

  test('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  test('should initialize selected items on ngOnInit', () => {
    // Arrange
    jest.spyOn(component as any, 'initializeSelectedItems');

    // Act
    component.ngOnInit();

    // Assert
    expect((component as any).initializeSelectedItems).toHaveBeenCalled();
  });

  test('when the value for onChangeSelectAll is true, then all selectedItems will be selected', () => {
    // Arrange
    component.filter = () => {};

    // Act
    component.onChangeSelectAll({ value: true } as TriStateCheckboxChangeEvent);

    // Assert
    expect(component.selectedItems).toEqual(component.options);
  });

  test('when the value for onChangeSelectAll is false, then all selectedItems will be unselected and selectAll will be null', () => {
    // Arrange
    component.filter = () => {};

    // Act
    component.onChangeSelectAll({
      value: false,
    } as TriStateCheckboxChangeEvent);

    // Assert
    expect(component.selectedItems).toEqual([]);
    expect(component.selectAll).toBe(null);
  });

  test('should update selectedAll to true when all options are checked', () => {
    // Arrange
    component.filter = () => {};
    const optionsChecked = component.options;
    // Act
    component.onChangeOption({
      value: optionsChecked,
    } as ListboxChangeEvent);

    // Assert
    expect(component.selectAll).toBe(true);
  });

  test('should update selectedAll to false when at least one option is checked but not all', () => {
    // Arrange
    component.filter = () => {};
    const optionsChecked = [{ label: 'Option 1', value: '1' }];

    // Act
    component.onChangeOption({
      value: optionsChecked,
    } as ListboxChangeEvent);

    // Assert
    expect(component.selectAll).toBe(false);
  });

  test('should update selectedAll to null when no option is checked', () => {
    // Arrange
    component.filter = () => {};
    const optionsChecked: any = [];

    // Act
    component.onChangeOption({
      value: optionsChecked,
    } as ListboxChangeEvent);

    // Assert
    expect(component.selectAll).toBe(null);
  });

  test('should update selectedAll null when the value is wrong type', () => {
    // Arrange
    component.filter = () => {};
    const optionsChecked: any = undefined;

    // Act
    component.onChangeOption({
      value: optionsChecked,
    } as ListboxChangeEvent);

    // Assert
    expect(component.selectAll).toBe(null);
  });
});
