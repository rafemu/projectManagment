import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[BoldLine]'
})
export class BoldLineDirective {

  @Input() color:any;
  @Input() size:any;

  public el: any;

  constructor(public element: ElementRef, private renderer: Renderer2) {
    this.el = element;
  }

  @HostListener('mouseover')
  onMouseOver() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.color);
    this.renderer.setStyle(this.el.nativeElement, 'font-size', this.size);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', "white");
    this.renderer.setStyle(this.el.nativeElement, 'font-size', null);
  }

}
