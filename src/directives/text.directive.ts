import { Directive, ElementRef, Input, Renderer } from '@angular/core';

@Directive({ selector: '[text_question]' })

export class TextDirective {
    constructor(el: ElementRef, renderer: Renderer) {
        renderer.setElementProperty(el.nativeElement, 'type', 'password');
    }
}