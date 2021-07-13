import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { HasElementRef } from '@angular/material/core/common-behaviors/color';

@Directive({
  selector: '[appMatIcon]',
})
export class MatIconDirective {
  @Output() onValueChanged = new EventEmitter<any>();
  @Input('appMatIcon') btn: HasElementRef;
  constructor(private renderer: Renderer2) {}

  @HostListener('click', ['$event'])
  onClick($event){
    $event.preventDefault();
    this.onValueChanged.emit(false)
  }
  @HostListener('mouseover')
  onMouseOver(){
    this.btn._elementRef.nativeElement.style.width='60px'
    this.btn._elementRef.nativeElement.style.height='60px'
    this.btn._elementRef.nativeElement.style.transition='width 4s, height 4s'
    this.onValueChanged.emit(true)
  }
  @HostListener('mouseleave')
  onMouseLeave(){
    this.btn._elementRef.nativeElement.style.width='0px'
    this.btn._elementRef.nativeElement.style.height='0px'
    this.onValueChanged.emit(false)
  }
}
