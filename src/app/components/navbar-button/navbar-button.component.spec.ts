import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarButtonComponent } from './navbar-button.component';

describe('NavbarButtonComponent', () => {
    let component: NavbarButtonComponent;
    let fixture: ComponentFixture<NavbarButtonComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NavbarButtonComponent],
            providers: [],
        });
        fixture = TestBed.createComponent(NavbarButtonComponent);
        component = fixture.componentInstance;
    });

    test('should initialize with default values', () => {
        // Assert
        expect(component.badgeCounter()).toBeUndefined();
        expect(component.icon()).toBeUndefined();
        expect(component.iconPosition()).toBe('left');
        expect(component.isActive()).toBe(false);
        expect(component.isDisabled()).toBe(false);
        expect(component.isMobileTextVisible()).toBe(false);
        expect(component.label()).toBeUndefined();
        expect(component.arialabel()).toBeUndefined();
    });

    test('should set properties correctly', () => {
        // Arrange
        fixture.componentRef.setInput('badgeCounter', 5);
        fixture.componentRef.setInput('icon', 'user');
        fixture.componentRef.setInput('iconPosition', 'right');
        fixture.componentRef.setInput('isActive', true);
        fixture.componentRef.setInput('isDisabled', true);
        fixture.componentRef.setInput('isMobileTextVisible', true);
        fixture.componentRef.setInput('label', 'Rabbit');

        // Act
        TestBed.flushEffects();
        fixture.detectChanges();

        // Assert
        expect(component.badgeCounter()).toBe(5);
        expect(component.icon()).toBe('user');
        expect(component.iconPosition()).toBe('right');
        expect(component.isActive()).toBe(true);
        expect(component.isDisabled()).toBe(true);
        expect(component.isMobileTextVisible()).toBe(true);
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
    });
});