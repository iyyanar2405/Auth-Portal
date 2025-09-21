import { ElementRef, Renderer2 } from '@angular/core';

import { GridTooltipDirective } from './grid-tooltip.directive';

describe('GridTooltipDirective', () => {
  let directive: GridTooltipDirective;
  let elementRef: ElementRef;
  let renderer: Renderer2;

  beforeEach(() => {
    elementRef = { nativeElement: document.createElement('div') } as ElementRef;
    renderer = {
      setStyle: jest.fn(),
      removeStyle: jest.fn(),
    } as unknown as Renderer2;
    directive = new GridTooltipDirective(elementRef, renderer);
  });

  test('should create an instance', () => {
    // Assert
    expect(directive).toBeTruthy();
  });

  test('should apply style', () => {
    // Act
    directive['setStyle']();

    // Assert
    expect(renderer.setStyle).toHaveBeenCalledWith(
      elementRef.nativeElement,
      'max-width',
      `${elementRef.nativeElement.scrollWidth + 14}px`,
    );
  });

  test('should apply style on mouse enter if text is overflowing', () => {
    // Arrange
    jest.spyOn(directive as any, 'isTextOverflowing').mockReturnValue(true);
    jest.spyOn(directive as any, 'setStyle');

    // Act
    directive.onMouseEnter();

    // Assert
    expect((directive as any).setStyle).toHaveBeenCalled();
  });

  test('should not apply style on mouse enter if text is not overflowing', () => {
    // Arrange
    jest.spyOn(directive as any, 'isTextOverflowing').mockReturnValue(false);
    jest.spyOn(directive as any, 'setStyle');

    // Act
    directive.onMouseEnter();

    // Assert
    expect((directive as any).setStyle).not.toHaveBeenCalled();
  });

  test('should remove style', () => {
    // Act
    directive['setStyle']();
    directive['removeStyle']();

    // Assert
    expect(renderer.setStyle).toHaveBeenCalledWith(
      elementRef.nativeElement,
      'max-width',
      '',
    );
  });

  test('should remove style on mouse leave', () => {
    // Arrange
    jest.spyOn(directive as any, 'removeStyle');

    // Act
    directive.onMouseLeave();

    // Assert
    expect((directive as any).removeStyle).toHaveBeenCalled();
  });

  test('should handle empty previous style on removeStyle', () => {
    // Arrange
    directive['prevStyle'] = {};
    directive['removeStyle']();

    // Assert
    expect(renderer.setStyle).not.toHaveBeenCalled();
    expect(renderer.removeStyle).not.toHaveBeenCalled();
  });

  test('should correctly detect text overflow', () => {
    // Arrange
    Object.defineProperty(elementRef.nativeElement, 'scrollWidth', {
      value: 200,
    });
    Object.defineProperty(elementRef.nativeElement, 'offsetWidth', {
      value: 100,
    });

    // Assert
    expect(directive['isTextOverflowing']()).toBe(true);
  });

  test('should not detect text overflow when scrollWidth equals offsetWidth', () => {
    // Arrange
    Object.defineProperty(elementRef.nativeElement, 'scrollWidth', {
      value: 100,
    });
    Object.defineProperty(elementRef.nativeElement, 'offsetWidth', {
      value: 100,
    });

    // Assert
    expect(directive['isTextOverflowing']()).toBe(false);
  });

  test('should set text-overflow to intestial if scrollWidth <= offsetWidth', () => {
    // Arrange
    Object.defineProperty(elementRef.nativeElement, 'scrollWidth', {
      value: 100,
    });
    Object.defineProperty(elementRef.nativeElement, 'offsetWidth', {
      value: 100,
    });
    const setStyleSpy = jest.spyOn(renderer, 'setStyle');
    const removeStyleSpy = jest.spyOn(renderer, 'removeStyle');

    // Act
    directive.ngAfterViewInit();

    // Assert
    expect(setStyleSpy).toHaveBeenCalledWith(
      elementRef.nativeElement,
      'text-overflow',
      'initial',
    );
    expect(removeStyleSpy).not.toHaveBeenCalled();
  });

  test('should remove text-overflow style if scrollWidth > offsetWidth', () => {
    // Arrange
    jest
      .spyOn(elementRef.nativeElement, 'scrollWidth', 'get')
      .mockReturnValue(200);
    jest
      .spyOn(elementRef.nativeElement, 'offsetWidth', 'get')
      .mockReturnValue(100);
    const setStyleSpy = jest.spyOn((directive as any).renderer, 'setStyle');
    const removeStyleSpy = jest.spyOn(
      (directive as any).renderer,
      'removeStyle',
    );

    // Act
    directive.onWindowResize();

    // Assert
    expect(removeStyleSpy).toHaveBeenCalledWith(
      elementRef.nativeElement,
      'text-overflow',
    );
    expect(setStyleSpy).not.toHaveBeenCalled();
  });
});
