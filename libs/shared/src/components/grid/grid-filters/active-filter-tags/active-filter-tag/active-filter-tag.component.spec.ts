import { TranslocoService } from '@jsverse/transloco';

import { createTranslationServiceMock } from '../../../../../__mocks__/translation.service.mock';
import { ActiveFilterTagComponent } from './active-filter-tag.component';

describe('ActiveFilterTagComponent', () => {
  let component: ActiveFilterTagComponent;
  const translocoServiceMock: Partial<TranslocoService> =
    createTranslationServiceMock();

  beforeEach(async () => {
    jest.clearAllMocks();
    component = new ActiveFilterTagComponent(
      translocoServiceMock as TranslocoService,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should emit saveFilter event with tag when onSaveFilterClick is called', () => {
    // Arrange
    const saveFilterSpy = jest.spyOn(component.saveFilter, 'emit');
    component.tag = {
      label: 'Test Label',
      value: 'Test Value',
      isSaved: false,
      field: 'testKey',
      displayName: 'testType',
    };

    // Act
    component.onSaveFilterClick();

    // Assert
    expect(saveFilterSpy).toHaveBeenCalledWith({
      label: 'Test Label',
      value: 'Test Value',
      isSaved: true,
      field: 'testKey',
      displayName: 'testType',
    });
  });

  test('should emit deleteSavedFilter event with tag when onDeleteSavedFilterClick is called', () => {
    // Arrange
    const deleteSavedFilterSpy = jest.spyOn(
      component.deleteSavedFilter,
      'emit',
    );
    component.tag = {
      label: 'Test Label',
      value: 'Test Value',
      isSaved: true,
      field: 'testKey',
      displayName: 'testType',
    };

    // Act
    component.onDeleteSavedFilterClick();

    // Assert
    expect(deleteSavedFilterSpy).toHaveBeenCalledWith({
      label: 'Test Label',
      value: 'Test Value',
      isSaved: false,
      field: 'testKey',
      displayName: 'testType',
    });
  });
});
