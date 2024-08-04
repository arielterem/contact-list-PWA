import { Directive, HostListener, ElementRef, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSanitizeInput]',
  standalone: true
})
export class SanitizeInputDirective {

  constructor(private el: ElementRef<HTMLInputElement>, @Optional() @Self() private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = this.sanitize(input.value);
    input.value = sanitizedValue;
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(sanitizedValue, { emitEvent: false });
    }
  }

  private sanitize(value: string): string {
    // Remove leading spaces, collapse multiple spaces into one, and allow trailing spaces
    return value.replace(/^\s+/, '').replace(/\s\s+/g, ' ');
  }
}
