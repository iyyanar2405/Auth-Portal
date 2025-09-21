import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
} from '@angular/core';
import tippy, { Props } from 'tippy.js';

import { TooltipPlacements, TooltipThemes } from '../../constants';
import { TOOLTIP_CONSTANTS, TooltipState } from './tippy-tooltip.model';

@Directive({
  selector: '[sharedTippyTooltip]',
  standalone: true,
})
export class TippyTooltipDirective implements AfterViewInit, OnDestroy {
  private state: TooltipState = {
    instance: null,
    resizeObserver: null,
    resizeTimeout: null,
    showTooltipTimeout: null,
    boundEventListeners: [],
  };

  @Input('sharedTippyTooltip') content?: string;
  @Input() tooltipPlacement: TooltipPlacements = TooltipPlacements.Bottom;
  @Input() displayAlways = false;
  @Input() tooltipTheme: TooltipThemes = TooltipThemes.Dark;
  @Input() tippyAllowHTML = false;
  @Input() lazyInitialize = true;

  constructor(
    private el: ElementRef,
    private zone: NgZone,
  ) {
    this.initializeResizeObserver();
  }

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;

    if (this.state.resizeObserver) {
      this.state.resizeObserver.observe(element);
    }

    if (this.lazyInitialize && !this.displayAlways) {
      this.initializeLazyTooltip(element);
    } else if (!this.lazyInitialize) {
      this.initializeEagerTooltip(element);
    }
  }

  ngOnDestroy(): void {
    this.cleanupTimeouts();
    this.cleanupEventListeners();
    this.cleanupResizeObserver();
    this.cleanupTooltip();
  }

  private initializeResizeObserver(): void {
    this.zone.runOutsideAngular(() => {
      this.state.resizeObserver = new ResizeObserver(() => {
        if (this.state.resizeTimeout) {
          clearTimeout(this.state.resizeTimeout);
          this.state.resizeTimeout = null;
        }
        this.state.resizeTimeout = setTimeout(() => {
          this.checkOverflow();
        }, TOOLTIP_CONSTANTS.RESIZE_DEBOUNCE_MS);
      });
    });
  }

  private initializeLazyTooltip(element: HTMLElement): void {
    this.addEventListenerWithCleanup(
      element,
      'mouseenter',
      this.handleMouseEnter,
    );
    this.addEventListenerWithCleanup(
      element,
      'mouseleave',
      this.handleMouseLeave,
    );
  }

  private initializeEagerTooltip(element: HTMLElement): void {
    if (this.displayAlways || this.checkElementOverflow(element)) {
      this.createTooltip();

      if (
        this.state.instance &&
        (this.displayAlways || this.checkElementOverflow(element))
      ) {
        this.state.instance.enable();
      }
    }
  }

  private addEventListenerWithCleanup(
    element: HTMLElement,
    type: string,
    listener: EventListener,
  ): void {
    element.addEventListener(type, listener);
    this.state.boundEventListeners.push({ element, type, listener });
  }

  private handleMouseEnter = (): void => {
    if (this.state.instance) {
      this.state.instance.hide();
    }
    const element = this.el.nativeElement;

    if (!this.checkElementOverflow(element)) {
      return;
    }

    this.clearShowTooltipTimeout();

    if (!this.state.instance) {
      this.createTooltipWithoutListeners();
      this.showTooltipWithDelay();
    } else {
      this.showTooltipWithDelay();
    }
  };

  private showTooltipWithDelay(): void {
    if (!this.state.instance) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.clearShowTooltipTimeout();
      this.state.showTooltipTimeout = setTimeout(() => {
        if (this.state.instance) {
          this.state.instance.show();
        }
      }, TOOLTIP_CONSTANTS.SHOW_TOOLTIP_DELAY_MS);
    });
  }

  private clearShowTooltipTimeout(): void {
    if (this.state.showTooltipTimeout) {
      clearTimeout(this.state.showTooltipTimeout);
      this.state.showTooltipTimeout = null;
    }
  }

  private handleMouseLeave = (): void => {
    this.clearShowTooltipTimeout();

    if (this.state.instance) {
      this.state.instance.hide();

      if (!this.displayAlways) {
        this.cleanupTooltip();
      }
    }
  };

  private createTooltipWithoutListeners(): void {
    this.createTooltipInstance(this.el.nativeElement, false);
  }

  private createTooltip(): void {
    this.createTooltipInstance(this.el.nativeElement);
  }

  private createTooltipInstance(
    element: HTMLElement,
    withEventListeners = true,
  ): void {
    if (!this.state.instance) {
      this.state.instance = tippy(element, this.getTooltipConfig()) as any;
    }

    if (this.displayAlways) {
      this.state.instance?.show();
    } else if (withEventListeners) {
      this.setupTooltipEventListeners(element);
    }
  }

  private getTooltipConfig(): Partial<Props> {
    return {
      content: this.content || this.el.nativeElement.textContent,
      delay: [TOOLTIP_CONSTANTS.SHOW_TOOLTIP_DELAY_MS, 0],
      theme: this.tooltipTheme,
      arrow: true,
      placement: this.tooltipPlacement,
      trigger: 'manual',
      allowHTML: this.tippyAllowHTML,
      hideOnClick: false,
    };
  }

  private setupTooltipEventListeners(element: HTMLElement): void {
    this.zone.runOutsideAngular(() => {
      const showTooltip = () => {
        if (this.state.instance && this.checkElementOverflow(element)) {
          this.state.instance.show();
        }
      };

      const hideTooltip = () => {
        if (this.state.instance) {
          this.state.instance.hide();
        }
      };

      ['mouseenter', 'focus'].forEach((event) =>
        this.addEventListenerWithCleanup(element, event, showTooltip),
      );

      ['mouseleave', 'blur'].forEach((event) =>
        this.addEventListenerWithCleanup(element, event, hideTooltip),
      );
    });
  }

  private checkOverflow(): void {
    if (!this.state.instance || this.displayAlways) {
      return;
    }

    const element = this.el.nativeElement;
    const hasOverflow = this.checkElementOverflow(element);

    if (hasOverflow && !this.state.instance.state.isShown) {
      this.state.instance.show();
    } else if (!hasOverflow && this.state.instance.state.isShown) {
      this.state.instance.hide();
    }
  }

  private checkElementOverflow(element: HTMLElement): boolean {
    if (!element.textContent?.trim()) {
      return false;
    }

    if (element.scrollWidth > element.clientWidth) {
      return true;
    }

    const style = window.getComputedStyle(element);

    if (style.textOverflow !== 'ellipsis' && style.whiteSpace !== 'nowrap') {
      return false;
    }

    try {
      const range = document.createRange();
      range.selectNodeContents(element);
      const textWidth = range.getBoundingClientRect().width;

      const padding =
        parseFloat(style.paddingLeft || '0') +
        parseFloat(style.paddingRight || '0');

      return textWidth > element.clientWidth - padding;
    } catch (e) {
      return false;
    }
  }

  private cleanupTimeouts(): void {
    [this.state.resizeTimeout, this.state.showTooltipTimeout].forEach(
      (timeout) => {
        if (timeout) {
          clearTimeout(timeout);
        }
      },
    );
    this.state.resizeTimeout = null;
    this.state.showTooltipTimeout = null;
  }

  private cleanupEventListeners(): void {
    this.state.boundEventListeners.forEach(({ element, type, listener }) => {
      element.removeEventListener(type, listener);
    });
    this.state.boundEventListeners = [];
  }

  private cleanupResizeObserver(): void {
    if (this.state.resizeObserver) {
      this.state.resizeObserver.unobserve(this.el.nativeElement);
      this.state.resizeObserver.disconnect();
      this.state.resizeObserver = null;
    }
  }

  private cleanupTooltip(): void {
    if (this.state.instance) {
      this.state.instance.destroy();
      this.state.instance = null;
    }
  }
}
