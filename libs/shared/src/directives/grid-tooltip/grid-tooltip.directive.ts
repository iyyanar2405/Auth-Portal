import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

interface Styles {
  [key: string]: any;
}

@Directive({
  selector: '[sharedGridTooltip]',
  standalone: true,
})
export class GridTooltipDirective implements AfterViewInit {
  private style = {
    overflow: 'visible',
    'z-index': '10',
    position: 'absolute',
    background: '#f2fafd',
    'border-radius': '9px',
    padding: '0.75rem 1rem',
    'margin-top': '1.10rem',
    'box-shadow': '0px 2px 12px 0px rgba(0, 0, 0, 0.10)',
    'line-height': '19px',
  };

  private prevStyle: Styles = {};

  private _paddingSize = 'p-datatable-lg';

  @Input() set tooltipPaddingSize(value: string) {
    this._paddingSize = value;
    this.style.padding =
      value === 'p-datatable-lg' ? '0.75rem 1rem' : '0.5rem 0.75rem';
  }

  get tooltipPaddingSize(): string {
    return this._paddingSize;
  }

  @Input() set tooltipMarginTopSize(value: number) {
    this.style['margin-top'] = `${value}rem`;
  }

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
    Object.keys(this.style).forEach((key: string) => {
      const prevStyle = this.el.nativeElement.style[key];
      this.prevStyle[key] = prevStyle !== undefined ? prevStyle : null;
      this.renderer.setStyle(
        this.el.nativeElement,
        key,
        (this.style as any)[key],
      );
    });
    const width = this.el.nativeElement.scrollWidth + 14;
    this.prevStyle['max-width'] = this.el.nativeElement.style.maxWidth ?? null;
    this.renderer.setStyle(this.el.nativeElement, 'max-width', `${width}px`);
  }

  private removeStyle(): void {
    Object.keys(this.prevStyle).forEach((key: string) => {
      if (this.prevStyle[key] !== null) {
        this.renderer.setStyle(this.el.nativeElement, key, this.prevStyle[key]);
      } else {
        this.renderer.removeStyle(this.el.nativeElement, key);
      }
    });

    this.prevStyle = {};
  }

  private isTextOverflowing(): boolean {
    return (
      this.el.nativeElement.scrollWidth > this.el.nativeElement.offsetWidth
    );
  }
}
