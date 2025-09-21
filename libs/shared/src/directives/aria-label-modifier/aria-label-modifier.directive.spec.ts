import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AriaLabelModifierDirective } from './aria-label-modifier.directive';

@Component({
  imports: [AriaLabelModifierDirective],
  template: `
    <div cssSelector=".aria-element" id="container" sharedAriaLabelModifier>
      <div aria-labelledby="label1" class="aria-element">Content 1</div>
      <div aria-labelledby="label2" class="aria-element">Content 2</div>
      <div>Other Content</div>
    </div>
  `,
})
class TestHostComponent {}

describe('AriaLabelModifierDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, AriaLabelModifierDirective],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  test('should modify aria-labelledby to aria-label for matching elements', () => {
    // Arrange
    const element = fixture.debugElement.query(By.css('#container'));

    // Act
    const ariaElements =
      element.nativeElement.querySelectorAll('.aria-element');

    // Assert
    // Check if 'aria-labelledby' is removed and 'aria-label' is set
    expect(ariaElements[0].getAttribute('aria-labelledby')).toBeNull();
    expect(ariaElements[0].getAttribute('aria-label')).toBe('label1');

    expect(ariaElements[1].getAttribute('aria-labelledby')).toBeNull();
    expect(ariaElements[1].getAttribute('aria-label')).toBe('label2');
  });

  test('should not modify elements that do not match the cssSelector', () => {
    // Arrange
    const element = fixture.debugElement.query(By.css('#container'));

    // Act
    const nonAriaElement = element.nativeElement.querySelector(
      'div:not(.aria-element)',
    );

    // Assert
    // Check that the non-matching element is not modified
    expect(nonAriaElement.getAttribute('aria-labelledby')).toBeNull();
    expect(nonAriaElement.getAttribute('aria-label')).toBeNull();
  });
});
