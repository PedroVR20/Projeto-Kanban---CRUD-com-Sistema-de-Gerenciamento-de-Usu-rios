import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Column, ApiTask } from '../../models';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskCardComponent],
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent {
  @Input() column!: Column;
  @Input() hoveredTask: { columnId: string; index: number } | null = null;

  @Output() taskHover = new EventEmitter<{ columnId: string; index: number }>();
  @Output() taskLeave = new EventEmitter<void>();
  @Output() taskEdit = new EventEmitter<ApiTask>();
  @Output() taskDrop = new EventEmitter<CdkDragDrop<ApiTask[]>>();
  @Input() connectedTo: string[] = [];
 
  @Output() taskCancel = new EventEmitter<ApiTask>();

  onTaskDrop(event: CdkDragDrop<ApiTask[]>) {
    this.taskDrop.emit(event);
  }

  onDrop(event: CdkDragDrop<ApiTask[]>): void {
    this.taskDrop.emit(event);
  }

  onTaskCancel(task: ApiTask) {
    this.taskCancel.emit(task);
}
}
