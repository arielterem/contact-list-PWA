import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.scss'
})
export class ConfirmDeleteDialogComponent {
  @Input() message: string = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  isVisible: boolean = false;

  show(message: string): void {
    this.message = message;
    this.isVisible = true;
  }

  onConfirm(): void {
    this.isVisible = false;
    this.confirm.emit();
  }

  onCancel(): void {
    this.isVisible = false;
    this.cancel.emit();
  }
}
