import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Task, ApiTask } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TaskApiMockService {
  private tasks: ApiTask[] = [];
  private nextId = 1;

  constructor() { }

  getTarefas(): Observable<ApiTask[]> {
    console.log('[MOCK API] GET /tasks');
    return of(this.tasks).pipe(delay(300));
  }

  createTask(task: Task): Observable<ApiTask> {
    console.log('[MOCK API] POST /tasks', task);
    const newTask: ApiTask = {
      ...task,
      id: this.nextId.toString()
    };
    this.nextId++;
    this.tasks.push(newTask);
    return of(newTask).pipe(delay(300));
  }

  updateTask(id: string, task: Partial<ApiTask>): Observable<ApiTask> {
    console.log(`[MOCK API] PATCH /tasks/${id}`, task);
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return throwError(() => new Error('Task not found'));
    }
    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...task };
    return of(this.tasks[taskIndex]).pipe(delay(300));
  }

  deleteTask(id: string): Observable<void> {
    console.log(`[MOCK API] DELETE /tasks/${id}`);
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return throwError(() => new Error('Task not found'));
    }
    this.tasks.splice(taskIndex, 1);
    return of(undefined).pipe(delay(300));
  }

  updateTaskStatus(id: string, status: string): Observable<any> {
    console.log(`[MOCK API] PATCH /tasks/${id} (status only)`);
    return this.updateTask(id, { processStatus: status });
  }
}
