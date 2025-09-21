import {
  StatesClasses,
  STATUS_STATES_MAP,
  StatusStates,
} from '../../../../constants';
import { DEFAULT_CLASS_NAME, TagComponent } from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;

  beforeEach(async () => {
    component = new TagComponent();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('className should be', () => {
    test.each([
      [StatesClasses.VividOrange, StatusStates.ToBeConfirmed.toLowerCase()],
      [StatesClasses.SummerSky, StatusStates.Confirmed.toLowerCase()],
      [StatesClasses.FirebrickRed, StatusStates.FindingsOpen.toLowerCase()],
      [StatesClasses.SunflowerYellow, StatusStates.InProgress.toLowerCase()],
      [StatesClasses.FernGreen, StatusStates.Completed.toLowerCase()],
      [StatesClasses.AshGrey, StatusStates.Cancelled.toLowerCase()],
    ])('%s, when the status is %s', (expectedClassName, status) => {
      // Arrange
      component.tagClassesMap = STATUS_STATES_MAP;

      // Act
      component.tagValue = status;

      // Assert
      expect(component.className).toBe(expectedClassName);
    });

    test(`${DEFAULT_CLASS_NAME} when the statusClassMap is not provided`, () => {
      // Act
      component.tagValue = StatusStates.ToBeConfirmed;

      // Assert
      expect(component.className).toBe(DEFAULT_CLASS_NAME);
    });

    test(`${DEFAULT_CLASS_NAME} when the severity is not found in the status states map`, () => {
      // Arrange
      component.tagClassesMap = STATUS_STATES_MAP;

      // Act
      component.tagValue = 'new status';

      // Assert
      expect(component.className).toBe(DEFAULT_CLASS_NAME);
    });

    test(`empty string when the statusClassMap and status are not provided`, () => {
      // Assert
      expect(component.className).toBe('');
    });
  });
});
