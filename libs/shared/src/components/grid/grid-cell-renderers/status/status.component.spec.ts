import { StatusComponent } from './status.component';

describe('StatusComponent', () => {
  let component: StatusComponent;

  beforeEach(async () => {
    component = new StatusComponent();
    component.statusClassMap = {
      open: 'sunflowerYellow',
      accepted: 'fernGreen',
      closed: 'ashGrey',
    };
  });

  test('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  test('should return correct class for status', () => {
    // Assert
    expect(component.getStatus('open')).toBe('sunflowerYellow');
    expect(component.getStatus('accepted')).toBe('fernGreen');
    expect(component.getStatus('closed')).toBe('ashGrey');
    expect(component.getStatus('')).toBe('misty-rose');
    expect(component.getStatus('open1')).toBe('misty-rose');
  });

  test('should set className when input value changes', () => {
    // Arrange
    component.value = 'open';
    // Assert
    expect(component.className).toBe('sunflowerYellow');
  });
});
