import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TooltipDirective } from './tooltip.directive';

@Component({
  imports: [TooltipDirective],
  template: `<div
    sharedTooltip
    style="width: 100px; white-space: nowrap; overflow: hidden;">
    Test Tooltip Content
  </div>`,
})
class TestComponent {}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, TooltipDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    debugElement = fixture.debugElement.query(By.directive(TooltipDirective));
  });

  test('should create the directive', () => {
    // Arrange
    const directive = debugElement.injector.get(TooltipDirective);

    // Assert
    expect(directive).toBeTruthy();
  });

  test('should display tooltip on mouseenter if text is overflowing', () => {
    // Arrange
    const { nativeElement } = debugElement;

    // Set a smaller width to ensure overflow occurs
    nativeElement.style.width = '50px';
    nativeElement.style.overflow = 'hidden';
    nativeElement.style.whiteSpace = 'nowrap'; // Prevent wrapping of text
    nativeElement.textContent = 'Test Tooltip Content'; // Set content

    jest.spyOn(nativeElement, 'scrollWidth', 'get').mockReturnValue(1400);
    jest.spyOn(nativeElement, 'offsetWidth', 'get').mockReturnValue(1000);

    fixture.detectChanges(); // Trigger change detection

    // Act
    debugElement.triggerEventHandler('mouseenter', null);

    // Assert: Check if tooltip was added
    const tooltip = nativeElement.querySelector('span');
    expect(tooltip).not.toBeNull();
    expect(tooltip.textContent).toBe('Test Tooltip Content'); // Ensure tooltip contains correct text
  });

  test('should not display tooltip if text is not overflowing', () => {
    // Arrange
    const { nativeElement } = debugElement;

    // Simulate no overflow by setting width to accommodate content
    nativeElement.style.width = '100px'; // Set width to fit content
    nativeElement.style.overflow = 'hidden'; // Ensure overflow is hidden
    nativeElement.textContent = 'Test Tooltip Content'; // Set content
    fixture.detectChanges(); // Trigger change detection

    // Act
    debugElement.triggerEventHandler('mouseenter', null);

    // Assert: Check if tooltip was not added
    expect(nativeElement.querySelector('span')).toBeNull();
  });

  test('should remove tooltip on mouseleave', () => {
    // Arrange
    const { nativeElement } = debugElement;

    // Simulate overflowing content
    nativeElement.style.width = '50px'; // Force overflow
    nativeElement.style.overflow = 'hidden'; // Ensure overflow is hidden
    nativeElement.textContent = 'Test Tooltip Content'; // Set content
    fixture.detectChanges(); // Trigger change detection
    debugElement.triggerEventHandler('mouseenter', null); // Show tooltip

    // Act
    debugElement.triggerEventHandler('mouseleave', null);

    // Assert: Check if tooltip was removed
    expect(nativeElement.querySelector('span')).toBeNull();
  });

  test('should remove tooltip on touchend', () => {
    // Arrange
    const { nativeElement } = debugElement;

    // Simulate overflowing content
    nativeElement.style.width = '50px'; // Force overflow
    nativeElement.style.overflow = 'hidden'; // Ensure overflow is hidden
    nativeElement.textContent = 'Test Tooltip Content'; // Set content
    fixture.detectChanges(); // Trigger change detection
    debugElement.triggerEventHandler('mouseenter', null); // Show tooltip

    // Act
    debugElement.triggerEventHandler('touchend', null);

    // Assert: Check if tooltip was removed
    expect(nativeElement.querySelector('span')).toBeNull();
  });

  test('should adjust text-overflow style on ngAfterViewInit when text is not overflowing', () => {
    // Arrange
    const { nativeElement } = debugElement;
    nativeElement.style.width = '100px'; // Ensure it fits the content
    nativeElement.style.overflow = 'hidden'; // Ensure overflow is hidden
    nativeElement.textContent = 'Test Tooltip Content'; // Set content
    fixture.detectChanges(); // Trigger change detection

    // Act
    debugElement.injector.get(TooltipDirective).ngAfterViewInit();

    // Assert: Verify that text-overflow style is set to initial
    expect(nativeElement.style.textOverflow).toBe('initial');
  });

  test('should adjust text-overflow style on ngAfterViewInit when text is overflowing', () => {
    // Arrange
    const { nativeElement } = debugElement;
    nativeElement.style.width = '50px'; // Set a smaller width to ensure overflow
    nativeElement.style.overflow = 'hidden'; // Ensure overflow is hidden
    nativeElement.textContent = 'Test Tooltip Content'; // Set content
    fixture.detectChanges(); // Trigger change detection

    // Act
    debugElement.injector.get(TooltipDirective).ngAfterViewInit();

    // Assert: Verify that text-overflow style is not set
    expect(nativeElement.style.textOverflow).toBe('initial');
  });
});
