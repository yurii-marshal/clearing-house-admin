import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[appPreventCopyPaste]'
})
export class PreventCopyPasteDirective {
    constructor(private e: ElementRef) { }

    @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
        e.preventDefault();
    }

    @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
        e.preventDefault();
    }

    @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
        e.preventDefault();
    }
}