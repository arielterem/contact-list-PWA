import { Directive, HostListener, ElementRef, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSanitizeNumbersInput]',
  standalone: true
})
export class SanitizeNumbersInputDirective {

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
    // Allow only digits 0-9, no spaces
    return value.replace(/[^0-9]/g, '');
  }
}
