import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({ selector: '[text_question]' })

export class TextDirective {
    constructor(el: ElementRef, renderer: Renderer) {
        renderer.setElementProperty(el.nativeElement, 'type', 'password');
    }
}