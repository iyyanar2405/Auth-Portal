import { GridEventActionType } from '../../../../models';
import { EventActionComponent } from './event-action.component';

describe('EventActionComponent', () => {
  let component: EventActionComponent;

  beforeEach(() => {
    component = new EventActionComponent();
    component.id = '123'; // Set the ID input
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should emit event when action is clicked with valid action type', () => {
    // Arrange
    const actionType = GridEventActionType.AddToCalendar; // Use actual enum value
    const expectedEvent = {
      id: '123',
      actionType: GridEventActionType.AddToCalendar,
    };
    const triggerActionEmitSpy = jest.spyOn(
      component.triggerEventAction,
      'emit',
    );

    // Act
    component.onActionClick(actionType);

    // Assert (fixed typo from "As" to "Assert")
    expect(triggerActionEmitSpy).toHaveBeenCalledWith(expectedEvent);
  });

  test('should not emit event when action is clicked with invalid action type', () => {
    // Arrange
    const invalidActionType = 'Invalid Action';
    const triggerActionEmitSpy = jest.spyOn(
      component.triggerEventAction,
      'emit',
    );

    // Act
    component.onActionClick(invalidActionType);

    // Assert
    expect(triggerActionEmitSpy).not.toHaveBeenCalled();
  });

  test('should emit confirm event when confirm button is clicked', () => {
    // Arrange
    const expectedEvent = {
      id: '123',
      actionType: GridEventActionType.Confirm,
    };
    const triggerActionEmitSpy = jest.spyOn(
      component.triggerEventAction,
      'emit',
    );

    // Act
    component.onConfirmClick();

    // Assert
    expect(triggerActionEmitSpy).toHaveBeenCalledWith(expectedEvent);
  });
});
