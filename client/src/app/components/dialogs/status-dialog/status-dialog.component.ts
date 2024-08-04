import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-status-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-dialog.component.html',
  styleUrl: './status-dialog.component.scss'
})
export class StatusDialogComponent {
  @Input() message: string = '';
  @Input() success: boolean = true;
  @Output() close = new EventEmitter<void>();

  isVisible: boolean = false;

  show(message: string, success: boolean = true): void {
    
    this.success = success
    this.message = message;
    this.isVisible = true;
  }

  onClose(): void {
    this.isVisible = false;
    this.close.emit();
  }
}
