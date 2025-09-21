import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[sharedTooltip]',
  standalone: true,
})
export class TooltipDirective implements AfterViewInit {
  private style = {
    overflow: 'visible',
    'z-index': '10',
    position: 'absolute',
    background: '#f2fafd',
    'border-radius': '9px',
    padding: '0.75rem 1rem',
    'box-shadow': '0px 2px 12px 0px rgba(0, 0, 0, 0.10)',
    left: '0',
    top: '-6px',
  };

  tooltipElement?: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('mouseenter')
  @HostListener('touchstart')
  onMouseEnter(): void {
    if (this.isTextOverflowing()) {
      this.setStyle();
    }
  }

  @HostListener('mouseleave')
  @HostListener('touchend')
  onMouseLeave(): void {
    this.removeStyle();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.checkElipsis();
  }

  ngAfterViewInit(): void {
    this.checkElipsis();
  }

  private checkElipsis(): void {
    if (
      this.el.nativeElement.scrollWidth <= this.el.nativeElement.offsetWidth
    ) {
      this.renderer.setStyle(this.el.nativeElement, 'text-overflow', 'initial');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'text-overflow');
    }
  }

  private setStyle(): void {
    const tooltip = this.renderer.createElement('span');

    Object.keys(this.style).forEach((key: string) => {
      this.renderer.setStyle(tooltip, key, (this.style as any)[key]);
    });

    const text = this.renderer.createText(this.el.nativeElement.textContent);
    this.renderer.appendChild(tooltip, text);

    this.renderer.appendChild(this.el.nativeElement, tooltip);
    this.tooltipElement = tooltip;
  }

  private removeStyle(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
      this.tooltipElement = undefined;
    }
  }

  private isTextOverflowing(): boolean {
    return (
      this.el.nativeElement.scrollWidth > this.el.nativeElement.offsetWidth
    );
  }
}
