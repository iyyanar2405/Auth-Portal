import { ElementRef, NgZone } from '@angular/core';
import tippy, { Instance } from 'tippy.js';

import { TooltipPlacements, TooltipThemes } from '../../constants';
import { TippyTooltipDirective } from './tippy-tooltip.directive';
import { TOOLTIP_CONSTANTS } from './tippy-tooltip.model';

jest.mock('tippy.js');

describe('TippyTooltipDirective', () => {
  let directive: TippyTooltipDirective;
  let mockElementRef: ElementRef<HTMLElement>;
  let mockElement: HTMLElement;
  let mockTippyInstance: Instance;
  let mockNgZone: NgZone;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElementRef = new ElementRef(mockElement);

    mockNgZone = {
      runOutsideAngular: jest.fn((fn) => fn()),
    } as Partial<NgZone> as NgZone;

    mockTippyInstance = {
      enable: jest.fn(),
      disable: jest.fn(),
      destroy: jest.fn(),
      show: jest.fn(),
      hide: jest.fn(),
      state: {
        isShown: false,
        destroyed: false,
      },
    } as unknown as Instance;

    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    mockElement.addEventListener = jest.fn();
    mockElement.removeEventListener = jest.fn();

    (tippy as unknown as jest.Mock).mockReturnValue(mockTippyInstance);

    directive = new TippyTooltipDirective(mockElementRef, mockNgZone);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should create directive instance', () => {
      expect(directive).toBeTruthy();
    });
    it('should initialize with default values', () => {
      expect(directive['displayAlways']).toBeFalsy();
      expect(directive['lazyInitialize']).toBeTruthy();
      expect(directive['tooltipPlacement']).toBe(TooltipPlacements.Bottom);
      expect(directive['tooltipTheme']).toBe(TooltipThemes.Dark);
    });
  });

  describe('Mouse Event Handling', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should create and show tooltip on mouse enter when overflow exists', () => {
      // Setup overflow conditions
      Object.defineProperty(mockElement, 'scrollWidth', { value: 200 });
      Object.defineProperty(mockElement, 'clientWidth', { value: 100 });
      mockElement.textContent = 'test';

      // Initialize directive
      directive.ngAfterViewInit();

      // Get and trigger mouseenter listener
      const mouseenterCalls = (mockElement.addEventListener as jest.Mock).mock
        .calls;
      const mouseenterListener = mouseenterCalls.find(
        (call) => call[0] === 'mouseenter',
      )[1];
      mouseenterListener();

      // Advance timers by show tooltip delay
      jest.advanceTimersByTime(TOOLTIP_CONSTANTS.SHOW_TOOLTIP_DELAY_MS);

      // Verify tooltip was created and shown
      expect(tippy).toHaveBeenCalled();
      expect(mockTippyInstance.show).toHaveBeenCalled();
    });

    it('should not show tooltip when no overflow exists', () => {
      // Setup no overflow conditions
      Object.defineProperty(mockElement, 'scrollWidth', { value: 100 });
      Object.defineProperty(mockElement, 'clientWidth', { value: 100 });

      directive.ngAfterViewInit();

      const mouseenterCalls = (mockElement.addEventListener as jest.Mock).mock
        .calls;
      const mouseenterListener = mouseenterCalls.find(
        (call) => call[0] === 'mouseenter',
      )[1];
      mouseenterListener();

      jest.advanceTimersByTime(TOOLTIP_CONSTANTS.SHOW_TOOLTIP_DELAY_MS);

      expect(tippy).not.toHaveBeenCalled();
    });

    it('should hide and cleanup tooltip on mouse leave', () => {
      directive['state'].instance = mockTippyInstance;

      directive.ngAfterViewInit();

      const mouseleaveCalls = (mockElement.addEventListener as jest.Mock).mock
        .calls;
      const mouseleaveListener = mouseleaveCalls.find(
        (call) => call[0] === 'mouseleave',
      )[1];
      mouseleaveListener();

      expect(mockTippyInstance.hide).toHaveBeenCalled();
      expect(directive['state'].instance).toBeNull();
    });

    it('should clear show timeout on mouse leave', () => {
      directive.ngAfterViewInit();

      // Trigger mouseenter
      const mouseenterCalls = (mockElement.addEventListener as jest.Mock).mock
        .calls;
      const mouseenterListener = mouseenterCalls.find(
        (call) => call[0] === 'mouseenter',
      )[1];
      mouseenterListener();

      // Trigger mouseleave before timer completes
      const mouseleaveCalls = (mockElement.addEventListener as jest.Mock).mock
        .calls;
      const mouseleaveListener = mouseleaveCalls.find(
        (call) => call[0] === 'mouseleave',
      )[1];
      mouseleaveListener();

      jest.advanceTimersByTime(TOOLTIP_CONSTANTS.SHOW_TOOLTIP_DELAY_MS);

      expect(mockTippyInstance.show).not.toHaveBeenCalled();
    });
  });

  describe('Tooltip Configuration', () => {
    it('should create tooltip with correct config', () => {
      const content = 'Test content';
      directive['content'] = content;

      (directive as any).createTooltip();

      expect(tippy).toHaveBeenCalledWith(
        mockElement,
        expect.objectContaining({
          content,
          delay: [TOOLTIP_CONSTANTS.SHOW_TOOLTIP_DELAY_MS, 0],
          theme: TooltipThemes.Dark,
          arrow: true,
          placement: TooltipPlacements.Bottom,
          trigger: 'manual',
          allowHTML: false,
          hideOnClick: false,
        }),
      );
    });

    it('should use element text content when no content input is provided', () => {
      const textContent = 'Element content';
      mockElement.textContent = textContent;

      (directive as any).createTooltip();

      expect(tippy).toHaveBeenCalledWith(
        mockElement,
        expect.objectContaining({
          content: textContent,
        }),
      );
    });
  });

  describe('Cleanup', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should cleanup all resources on destroy', () => {
      const { resizeObserver } = (directive as any).state;
      const unobserveSpy = jest.spyOn(resizeObserver, 'unobserve');
      const disconnectSpy = jest.spyOn(resizeObserver, 'disconnect');

      directive['state'].instance = mockTippyInstance;
      directive.ngOnDestroy();

      expect(unobserveSpy).toHaveBeenCalledWith(mockElement);
      expect(disconnectSpy).toHaveBeenCalled();
      expect(mockTippyInstance.destroy).toHaveBeenCalled();
      expect(directive['state'].instance).toBeNull();
      expect(directive['state'].resizeObserver).toBeNull();
    });

    it('should cleanup timeouts', () => {
      const timeout1 = setTimeout(() => {}, 1000);
      const timeout2 = setTimeout(() => {}, 1000);
      directive['state'].resizeTimeout = timeout1;
      directive['state'].showTooltipTimeout = timeout2;

      directive.ngOnDestroy();

      expect(directive['state'].resizeTimeout).toBeNull();
      expect(directive['state'].showTooltipTimeout).toBeNull();
    });

    it('should remove all event listeners', () => {
      directive.ngAfterViewInit();
      directive.ngOnDestroy();

      expect(mockElement.removeEventListener).toHaveBeenCalled();
      expect(directive['state'].boundEventListeners).toHaveLength(0);
    });
  });
});
