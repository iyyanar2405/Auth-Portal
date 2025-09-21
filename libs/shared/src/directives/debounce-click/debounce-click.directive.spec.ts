import { EventEmitter } from '@angular/core';

import { DebounceClickDirective } from './debounce-click.directive';

describe('DebounceClickDirective', () => {
  let directive: DebounceClickDirective;

  beforeEach(() => {
    directive = new DebounceClickDirective();
  });

  test('should emit event after debounce time when clicked', () => {
    // Arrange
    directive.debounceTime = 300;
    const eventMock = new MouseEvent('click');
    jest.spyOn(eventMock, 'preventDefault');
    jest.spyOn(eventMock, 'stopPropagation');
    const nextSpy = jest.spyOn(directive['clicks'], 'next');

    // Act
    directive.ngOnInit();
    directive.clickEvent(eventMock);

    // Assert
    expect(eventMock.preventDefault).toHaveBeenCalled();
    expect(eventMock.stopPropagation).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(eventMock);
  });

  test('should unsubscribe from clicks on destroy', () => {
    // Arrange
    const unsubscribeSpy = jest.spyOn(directive['subscription'], 'unsubscribe');

    // Act
    directive.ngOnDestroy();

    // Assert
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  test('should initialize with default debounceTime if not provided', () => {
    // Act
    directive.ngOnInit();

    // Assert
    expect(directive.debounceTime).toBe(500);
  });

  test('should subscribe to clicks with debounceTime on initialization', () => {
    // Arrange
    directive.debounceTime = 300;
    directive.debounceClick = new EventEmitter();

    const clicksSpy = jest.spyOn(directive['clicks'], 'pipe');

    // Act
    directive.ngOnInit();

    // Assert
    expect(clicksSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  test('should emit event after debounce time on click', (done) => {
    // Arrange
    directive.debounceTime = 100;
    const debounceClickSpy = jest.spyOn(directive.debounceClick, 'emit');

    directive.ngOnInit();

    // Act
    const event = new MouseEvent('click');
    directive.clickEvent(event);

    // Assert
    setTimeout(() => {
      expect(debounceClickSpy).toHaveBeenCalledWith(event);
      directive.ngOnDestroy(); // Cleanup
      done();
    }, 150); // Ensure the delay is longer than debounceTime
  });
});
