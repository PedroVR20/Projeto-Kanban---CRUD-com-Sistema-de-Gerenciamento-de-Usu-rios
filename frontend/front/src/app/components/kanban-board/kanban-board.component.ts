// ==================================================================
// ARQUIVO: kanban-board.component.ts (VERSÃO FINAL)
// ==================================================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Subscription, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ColumnComponent } from '../column/column.component';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { Column, ApiTask, FilterData, PedidoFormData } from '../../models';
import { KanbanService } from '../../services/kanban.service';
import { ModalService } from '../../shared/modal.service';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { ReasonModalComponent } from '../reason-modal/reason-modal.component';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule, DragDropModule, ColumnComponent, TaskModalComponent,
    FilterModalComponent, ReasonModalComponent
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit, OnDestroy {
  public columns: Column[] = [];
  private subscription = new Subscription();

  public showFilterModal = false;
  public taskToEdit: ApiTask | null = null;
  public showTaskModal = false;
  public isSubmitting: boolean = false;
  public showConfirmCancelModal = false;
  public taskToCancel: ApiTask | null = null;
  public hoveredTask: { columnId: string; index: number } | null = null;

  constructor(
    private kanbanService: KanbanService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    // A sua lógica de filtro era mais complexa, restaurei ela.
    this.subscription.add(
      this.kanbanService.columns$.subscribe(allColumns => {
        const currentFilter = this.kanbanService.getCurrentFilter();
        this.applyFilter(allColumns, currentFilter);
      })
    );
    this.subscription.add(
      this.kanbanService.filter$.subscribe(filterData => {
        const allColumns = this.kanbanService.getColumnsValue(); // Pega o valor atual
        this.applyFilter(allColumns, filterData);
      })
    );
    this.subscription.add(this.modalService.openModal$.subscribe(() => this.openTaskModal()));
    this.subscription.add(this.modalService.openFilterModal$.subscribe(() => this.openFilterModal()));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Lógica de drop simplificada para delegar ao serviço
  drop(event: CdkDragDrop<ApiTask[]>) {
    if (event.previousContainer !== event.container) {
      const taskMovida = event.previousContainer.data[event.previousIndex];
      const colunaDeDestino = this.columns.find(c => c.id === event.container.id);
      const novoStatus = colunaDeDestino ? colunaDeDestino.name : '';

      if (novoStatus) {
        this.kanbanService.updateTask(taskMovida.id, { processStatus: novoStatus }).subscribe();
      }
    }
  }

  // Lógica de filtro restaurada
  private applyFilter(allColumns: Column[], filter: FilterData): void {
    let filteredColumns = JSON.parse(JSON.stringify(allColumns));
    const hasFilter = filter.clientName || filter.clientId || filter.file;

    if (hasFilter) {
      const name = (filter.clientName || '').toLowerCase().trim();
      const id = (filter.clientId || '').toLowerCase().trim();
      const file = (filter.file || '').toLowerCase().trim();

      for (const column of filteredColumns) {
        column.tasks = column.tasks.filter((task: ApiTask) => {
          const nameMatch = name ? (task.clientName || '').toLowerCase().includes(name) : true;
          const idMatch = id ? (task.clientId || '').toLowerCase().includes(id) : true;
          const fileMatch = file ? (task.file || '').toLowerCase().includes(file) : true;
          return nameMatch && idMatch && fileMatch;
        });
      }
    }
    this.columns = filteredColumns;
  }

  public openFilterModal(): void { this.showFilterModal = true; }
  public closeFilterModal(): void { this.showFilterModal = false; }
  public onFilterApply(filterData: FilterData): void {
    this.kanbanService.setFilter(filterData);
  }

  
  openTaskModal(taskToEdit: ApiTask | null = null): void {
  if (taskToEdit) {
    const freshTask = this.kanbanService.getTaskById(taskToEdit.id);

    if (freshTask) {
      // ==================================================================
      // A CORREÇÃO FINAL ESTÁ AQUI.
      // Nós forçamos o Angular a destruir e recriar o objeto.
      // Ao fazer `this.taskToEdit = null` primeiro, garantimos que o Angular
      // veja uma mudança real quando atribuímos a nova tarefa logo em seguida.
      // ==================================================================
      this.taskToEdit = null; // Força a detecção de mudança
      setTimeout(() => {
        this.taskToEdit = freshTask;
        this.showTaskModal = true;
      }, 0); // O timeout garante que a UI tenha tempo de processar o 'null'

    } else {
      console.error(`[BOARD] Falha ao encontrar a tarefa ${taskToEdit.id} no serviço.`);
      this.taskToEdit = taskToEdit;
      this.showTaskModal = true;
    }
  } else {
    // Modo de criação
    this.taskToEdit = null;
    this.showTaskModal = true;
  }
}

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.taskToEdit = null;
  }

  onTaskSubmit(formData: PedidoFormData): void {
    this.isSubmitting = true;
    const operation = this.taskToEdit
      ? this.kanbanService.updateTask(this.taskToEdit.id, formData)
      : this.kanbanService.addTask(formData);

    operation.pipe(finalize(() => this.isSubmitting = false)).subscribe({
      next: () => this.closeTaskModal(),
      error: (err) => console.error('Falha na operação da tarefa:', err)
    });
  }

  onTaskHover(event: { columnId: string; index: number }): void { this.hoveredTask = event; }
  onTaskLeave(): void { this.hoveredTask = null; }

  onTaskCancel(task: ApiTask): void {
    this.taskToCancel = task;
    this.showConfirmCancelModal = true;
  }

  closeConfirmCancelModal(): void {
    this.showConfirmCancelModal = false;
    this.taskToCancel = null;
  }

  confirmCancelTask(reason: string): void {
    if (!this.taskToCancel) return;
    this.kanbanService.deleteTask(this.taskToCancel.id, reason).subscribe({
      next: () => this.closeConfirmCancelModal(),
      error: (err) => console.error('Falha ao cancelar tarefa:', err)
    });
  }

  getTaskTitleForCancel(): string {
    return this.taskToCancel ? this.taskToCancel.clientName : '';
  }

  get availableColumns(): Column[] {
    return this.columns.filter(col => col.id !== 'vencido-column' && col.id !== 'arquivado-column');
  }

  public getColumnIds(): string[] {
    return this.columns.map(column => column.id);
  }
}
