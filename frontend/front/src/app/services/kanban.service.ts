// ==================================================================
// ARQUIVO: kanban.service.ts (VERSÃO FINAL E COMPLETA)
// ==================================================================
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Column, ApiTask, FilterData, PedidoFormData } from '../models';
import { TaskApiService } from './task-api.service';
import { UserDataService } from './user-data.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
} )
export class KanbanService {
  private initialColumns: Column[] = [
    { id: 'aguardando-column', name: 'Aguardando preenchimento de formulário', tasks: [] },
    { id: 'cotado-column', name: 'Taxa consular a recolher', tasks: [] },
    { id: 'uc-column', name: 'Agendamento concluído', tasks: [] },
    { id: 'eventos-column', name: 'Orientações finalizadas', tasks: [] },
    { id: 'blackout-column', name: 'Aguardando agendamento', tasks: [] },
    { id: 'bloqueado-column', name: 'Visto negado', tasks: [] },
    { id: 'sinalizado-column', name: 'Visto aprovado', tasks: [] },
    { id: 'especulacao-column', name: 'Passaporte devolvido e finalizado', tasks: [] },
    { id: 'arquivado-column', name: 'Documentação em análise', tasks: [] }
  ];

  private columnsSubject = new BehaviorSubject<Column[]>(this.initialColumns);
  public columns$ = this.columnsSubject.asObservable();

  private filterSubject = new BehaviorSubject<FilterData>({ clientName: '', clientId: '', file: '' });
  public filter$ = this.filterSubject.asObservable();

  constructor(
    private taskApiService: TaskApiService,
    private userDataService: UserDataService
  ) {
    this.loadTasksFromApi();
    this.listenToUserChanges();
  }

  private listenToUserChanges(): void {
    if (this.userDataService && this.userDataService.decodedToken$) {
      this.userDataService.decodedToken$.subscribe((token: any) => {
        if (token) {
          console.log('[KANBAN-SERVICE] Novo usuário detectado. Recarregando tarefas...');
          this.loadTasksFromApi();
        } else {
          console.log('[KANBAN-SERVICE] Usuário deslogado. Limpando quadro...');
          this.clearTasks();
        }
      });
    }
  }

  // --- MÉTODOS DE LEITURA E FILTRO ---
  public setFilter(filter: FilterData): void { this.filterSubject.next(filter); }
  public getCurrentFilter(): FilterData { return this.filterSubject.value; }
  public getColumnsValue(): Column[] { return this.columnsSubject.getValue(); }

  public getTaskById(taskId: string): ApiTask | undefined {
    for (const column of this.getColumnsValue()) {
      const foundTask = column.tasks.find(task => task.id === taskId);
      if (foundTask) return foundTask;
    }
    return undefined;
  }

  public clearTasks(): void {
    this.columnsSubject.next(this.initialColumns);
  }

  // --- MÉTODOS DE MODIFICAÇÃO (CRUD) ---
  public loadTasksFromApi(): void {
    this.taskApiService.getTasks().subscribe({
      next: (apiTasks) => this.updateColumnsState(apiTasks),
      error: (err) => console.error('Erro ao carregar tarefas da API:', err)
    });
  }

  private updateColumnsState(apiTasks: ApiTask[]): void {
    const updatedColumns: Column[] = JSON.parse(JSON.stringify(this.initialColumns));
    apiTasks.forEach(apiTask => {
      if (!apiTask.processStatus) {
        console.warn(`AVISO: Tarefa ID ${apiTask.id} vinda da API sem 'processStatus'.`);
      }
      const targetColumn = updatedColumns.find(col => col.name === apiTask.processStatus);
      if (targetColumn) {
        targetColumn.tasks.push(apiTask);
      } else {
        updatedColumns[0].tasks.push(apiTask); // Coluna 'Aguardando'
      }
    });
    this.columnsSubject.next(updatedColumns);
  }

  public addTask(taskData: PedidoFormData): Observable<ApiTask> {
    return this.taskApiService.createTask(taskData).pipe(
      tap({
        next: () => this.loadTasksFromApi(),
        error: () => this.loadTasksFromApi() // Força recarga em erro para limpar fantasmas
      })
    );
  }

  public deleteTask(taskId: string, reason: string): Observable<void> {
    return this.taskApiService.deleteTask(taskId, reason).pipe(
      tap({
        next: () => this.loadTasksFromApi(),
        error: () => this.loadTasksFromApi() // Força recarga em erro para limpar fantasmas
      })
    );
  }

  public handleDrop(event: CdkDragDrop<ApiTask[]>) {
    if (event.previousContainer !== event.container) {
      const task = event.previousContainer.data[event.previousIndex];
      const newColumn = this.getColumnsValue().find(col => col.id === event.container.id);

      if (task && newColumn) {
        this.updateTask(task.id, { processStatus: newColumn.name }).subscribe({
          error: (err) => {
            console.error('Falha ao mover a tarefa:', err);
            this.loadTasksFromApi(); // Força recarga em erro para restaurar posição correta
          }
        });
      }
    }
  }

  public updateTask(taskId: string, formData: Partial<PedidoFormData>): Observable<ApiTask> {
    return this.taskApiService.updateTask(taskId, formData as PedidoFormData).pipe(
      tap({
        next: () => this.loadTasksFromApi(),
        error: () => this.loadTasksFromApi() // Força recarga em erro para limpar fantasmas
      })
    );
  }

}
