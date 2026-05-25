import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reason-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './reason-modal.component.html',
  styleUrls: ['./reason-modal.component.css']
})
export class ReasonModalComponent {
  @Input() isVisible = false;
  @Input() title = 'Confirmar Ação';
  @Input() confirmButtonText = 'Confirmar';
  @Input() taskTitle = '';
  
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>(); // Emite o motivo como uma string

  public reason = '';

  onClose(): void {
    this.close.emit();
    this.reason = ''; // Limpa o motivo ao fechar
  }

  onConfirm(): void {
    // A confirmação só é permitida se um motivo foi inserido
    if (this.reason.trim()) {
      this.confirm.emit(this.reason);
      this.reason = ''; // Limpa o motivo após a confirmação
    }
  }
}
