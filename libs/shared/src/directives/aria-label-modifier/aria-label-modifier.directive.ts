import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[sharedAriaLabelModifier]',
  standalone: true,
})
export class AriaLabelModifierDirective implements AfterViewInit {
  @Input() cssSelector!: string;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.modifyAriaAttributes();
  }

  private modifyAriaAttributes(): void {
    const elements = this.el.nativeElement.querySelectorAll(this.cssSelector);

    elements.forEach((element: HTMLElement) => {
      const ariaLabel = element.getAttribute('aria-labelledby');

      if (ariaLabel) {
        element.setAttribute('aria-label', ariaLabel);
        element.removeAttribute('aria-labelledby');
      }
    });
  }
}
