import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedButtonComponent } from './button.component';
import { SharedButtonType } from './button.constants';

describe('SharedButtonComponent', () => {
  let component: SharedButtonComponent;
  let fixture: ComponentFixture<SharedButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedButtonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SharedButtonComponent);
    component = fixture.componentInstance;
  });

  test('should initialize with default values', () => {
    // Arrange
    fixture.componentRef.setInput('type', SharedButtonType.Secondary);

    // Act
    TestBed.flushEffects();
    fixture.detectChanges();

    // Assert
    expect(component.type()).toBe(SharedButtonType.Secondary);
    expect(component.icon()).toBeUndefined();
    expect(component.iconPos()).toBe('left');
    expect(component.iconClass()).toBeUndefined();
    expect(component.isDisabled()).toBe(false);
    expect(component.label()).toBeUndefined();
  });

  test('should set properties correctly', () => {
    // Arrange
    fixture.componentRef.setInput('type', SharedButtonType.Primary);
    fixture.componentRef.setInput('icon', 'rabbit-icon');
    fixture.componentRef.setInput('iconPos', 'right');
    fixture.componentRef.setInput('isDisabled', true);
    fixture.componentRef.setInput('label', 'Rabbit');

    // Act
    TestBed.flushEffects();
    fixture.detectChanges();

    // Assert
    expect(component.type()).toBe(SharedButtonType.Primary);
    expect(component.icon()).toBe('rabbit-icon');
    expect(component.iconPos()).toBe('right');
    expect(component.iconClass()).toBe('pi pi-rabbit-icon');
    expect(component.isDisabled()).toBe(true);
    expect(component.label()).toBe('Rabbit');
  });

  test('should handle onClick correctly', () => {
    // Arrange
    const mockMouseEvent = new MouseEvent('click');
    const clickEventSpy = jest.spyOn(component.clickEvent, 'emit');

    // Act
    component.onClick(mockMouseEvent);

    // Assert
    expect(clickEventSpy).toHaveBeenCalledWith(mockMouseEvent);

    // Act
    component.onClick();

    // Assert
    expect(clickEventSpy).toHaveBeenCalledWith(undefined);
  });
});
