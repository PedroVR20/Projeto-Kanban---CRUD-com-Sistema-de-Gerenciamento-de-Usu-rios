import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PedidoFormData, ApiTask, PagedResponse } from '../models/task.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
} )
export class TaskApiService {
  private apiUrl = environment.apiPedidos;

  constructor(private http: HttpClient ) { }

  getTasks(): Observable<ApiTask[]> {
    const params = new HttpParams().set('size', '500').set('page', '0');
    return this.http.get<PagedResponse<ApiTask>>(this.apiUrl, { params }).pipe(
      map(response => response.content)
    );
  }

  createTask(taskData: PedidoFormData): Observable<ApiTask> {
    return this.http.post<ApiTask>(this.apiUrl, taskData );
  }

  updateTask(id: string, taskData: PedidoFormData): Observable<ApiTask> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<ApiTask>(url, taskData );
  }

  deleteTask(id: string, reason: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    const params = new HttpParams().set('reason', reason);
    return this.http.delete<void>(url, { params } );
  }
}
