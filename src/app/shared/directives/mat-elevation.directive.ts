import { Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appMatElevation]'
})
export class MatElevationDirective implements OnChanges {
  @Input() defaultElevation = 2
  @Input() raisedElevation = 8
  constructor(private elementRef: ElementRef,
    private renderer2: Renderer2) {
    this.setElevation(this.defaultElevation);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setElevation(this.defaultElevation);
  }
  @HostListener('mouseenter')
  onMouseEnter() {
    this.setElevation(this.raisedElevation)
  }
  @HostListener('mouseleave')
  onMouseLeave() {
    this.setElevation(this.defaultElevation)
  }
  setElevation(zNumber: number) {
    const classToRemove = Array.from((<HTMLElement>this.elementRef.nativeElement).classList)
      .filter(x => x.startsWith('mat-elevation-z'));
    classToRemove.forEach((item) => {
      this.renderer2.removeClass(this.elementRef.nativeElement, item)
    })
    const newClass = `mat-elevation-z${zNumber}`;
    this.renderer2.addClass(this.elementRef.nativeElement, newClass)
  }
}
