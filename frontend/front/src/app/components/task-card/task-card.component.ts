import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiTask } from '../../models';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
  @Input() task!: ApiTask;
  @Input() taskIndex!: number;
  @Input() columnId!: string;
  @Input() isHovered = false;

  // Evento para a ação de cancelar
  @Output() cancel = new EventEmitter<{ columnId: string; index: number }>();
  
  // Evento para a ação de editar
  @Output() edit = new EventEmitter<void>();

  // Eventos para o estado de hover (mouse sobre o card)
  @Output() hover = new EventEmitter<{ columnId: string; index: number }>();
  @Output() leave = new EventEmitter<void>();

  // Função chamada quando o botão "Cancelar" é clicado
  onCancelClick(event: MouseEvent): void {
    // Impede que o clique no botão propague para o card e acione o evento de edição
    event.stopPropagation();
    // Emite o evento de cancelamento com os dados da tarefa
    this.cancel.emit({ columnId: this.columnId, index: this.taskIndex });
  }
}
